const fs = require('fs');
const path = require('path');
const express = require('./express-lite');

const PORT = process.env.PORT || 4000;
const DATA_PATH = path.join(__dirname, '..', 'data', 'siteContent.json');
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

function ensureStorage() {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    const seed = {
      hero: {
        title: 'Welcome to the site',
        subtitle: 'Edit this hero section from the dashboard.',
        ctaText: 'Get Started',
        imageUrl: ''
      },
      sections: {
        about: {
          heading: 'About',
          content: 'Share your story and mission.'
        },
        services: {
          heading: 'Services',
          content: 'List the main services or initiatives here.'
        },
        contact: {
          heading: 'Contact',
          content: 'Provide ways for visitors to reach you.'
        }
      },
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

function loadContent() {
  ensureStorage();
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveContent(content) {
  const payload = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2));
  return payload;
}

function sanitizeFileName(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function decodeDataUrl(dataUrl) {
  const match = /^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/.exec(dataUrl || '');
  if (!match) {
    return null;
  }
  const buffer = Buffer.from(match[2], 'base64');
  return { mime: match[1], buffer };
}

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.get('/api/dashboard/content', (req, res) => {
  try {
    const content = loadContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load content', error: error.message });
  }
});

app.put('/api/dashboard/sections', (req, res) => {
  const incoming = req.body || {};
  try {
    const current = loadContent();
    const updated = { ...current };

    if (incoming.hero) {
      updated.hero = { ...current.hero, ...incoming.hero };
    }

    if (incoming.sections && typeof incoming.sections === 'object') {
      updated.sections = { ...current.sections, ...incoming.sections };
    }

    const saved = saveContent(updated);
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Unable to save updates', error: error.message });
  }
});

app.post('/api/dashboard/hero/image', (req, res) => {
  const { filename = 'hero-image', dataUrl } = req.body || {};
  const decoded = decodeDataUrl(dataUrl);
  if (!decoded) {
    res.status(400).json({ message: 'A valid base64 data URL is required.' });
    return;
  }

  try {
    ensureStorage();
    const safeName = `${Date.now()}-${sanitizeFileName(filename)}`;
    const extension = decoded.mime.split('/')[1] || 'png';
    const fileNameWithExt = safeName.endsWith(extension) ? safeName : `${safeName}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileNameWithExt);
    fs.writeFileSync(filePath, decoded.buffer);

    const current = loadContent();
    const publicPath = `/uploads/${fileNameWithExt}`;
    const saved = saveContent({ ...current, hero: { ...current.hero, imageUrl: publicPath } });

    res.json({ imageUrl: publicPath, content: saved });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save hero image', error: error.message });
  }
});

app.listen(PORT, () => {
  ensureStorage();
  // eslint-disable-next-line no-console
  console.log(`Dashboard backend running on http://localhost:${PORT}`);
});
