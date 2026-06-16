const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DIST_DIR = path.join(__dirname, '..', 'dist'); // Папка со сборкой

// Создаем папку uploads если её нет
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Раздаем загруженные картинки
app.use('/uploads', express.static(UPLOADS_DIR));

// API роуты
app.post('/api/upload', (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const filename = `bio_${uuidv4().slice(0, 8)}.png`;
    const filepath = path.join(UPLOADS_DIR, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const imageUrl = `${protocol}://${host}/uploads/${filename}`;
    
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
        const host = req.headers.host || `localhost:${PORT}`;
        return {
          filename: f,
          url: `${protocol}://${host}/uploads/${f}`,
          created: fs.statSync(path.join(UPLOADS_DIR, f)).birthtime
        };
      })
      .sort((a, b) => b.created - a.created);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// ★★★ Раздаем статику из dist (React приложение) ★★★
app.use(express.static(DIST_DIR));

// ★★★ Для React Router - отдаем index.html на все запросы ★★★
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running on port ${PORT}`);
  console.log(`🌐 App: http://localhost:${PORT}`);
  console.log(`📁 Uploads: ${UPLOADS_DIR}`);
});
