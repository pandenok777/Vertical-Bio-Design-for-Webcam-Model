const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DIST_DIR = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

app.post('/api/upload', (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: 'No image provided' });
        
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        const filename = 'bio_' + uuidv4().slice(0, 8) + '.png';
        const filepath = path.join(UPLOADS_DIR, filename);
        
        fs.writeFileSync(filepath, buffer);
        
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host || 'localhost:' + PORT;
        const imageUrl = protocol + '://' + host + '/uploads/' + filename;
        
        res.json({ success: true, url: imageUrl, filename });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to save image' });
    }
});

app.get('/api/images', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOADS_DIR)
            .filter(f => f.endsWith('.png'))
            .map(f => {
                const protocol = req.headers['x-forwarded-proto'] || 'http';
                const host = req.headers.host || 'localhost:' + PORT;
                return {
                    filename: f,
                    url: protocol + '://' + host + '/uploads/' + f,
                    created: fs.statSync(path.join(UPLOADS_DIR, f)).birthtime
                };
            })
            .sort((a, b) => b.created - a.created);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list images' });
    }
});

app.post('/api/render', async (req, res) => {
    let browser = null;
    try {
        const { html, css, fontCss, width, height, backgroundColor } = req.body;
        if (!html || !css || !width || !height) {
            return res.status(400).json({ error: 'Missing html, css, width or height' });
        }

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: Math.ceil(width), height: Math.ceil(height), deviceScaleFactor: 2 });

        const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${fontCss || ''}</style>
  <style>${css}</style>
  <style>
    body { margin: 0; padding: 0; background: ${backgroundColor || '#000000'}; display: flex; justify-content: center; align-items: flex-start; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 500));

        const screenshot = await page.screenshot({ type: 'png', fullPage: false });
        const dataUrl = `data:image/png;base64,${screenshot.toString('base64')}`;

        res.json({ success: true, image: dataUrl });
    } catch (error) {
        console.error('Render error:', error);
        res.status(500).json({ error: 'Failed to render image', details: error.message });
    } finally {
        if (browser) await browser.close();
    }
});

app.use(express.static(DIST_DIR));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:' + PORT);
});
