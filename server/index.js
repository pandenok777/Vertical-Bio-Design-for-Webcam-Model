const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Создаем папку uploads если её нет
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Загрузка изображения на сервер
app.post('/api/upload', (req, res) => {
  try {
    const { image } = req.body; // base64 строка
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Убираем префикс data:image/png;base64,
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const filename = `bio_${uuidv4().slice(0, 8)}.png`;
    const filepath = path.join(UPLOADS_DIR, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    // Возвращаем URL картинки
    const host = req.headers.host || `localhost:${PORT}`;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const imageUrl = `${protocol}://${host}/uploads/${filename}`;
    
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Получение списка всех сохраненных картинок
app.get('/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR)
      .filter(f => f.endsWith('.png'))
      .map(f => {
        const host = req.headers.host || `localhost:${PORT}`;
        const protocol = req.headers['x-forwarded-proto'] || 'http';
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${UPLOADS_DIR}`);
});
