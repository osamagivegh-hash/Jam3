const fs = require('fs');
const path = require('path');
const multer = require('./lib/multer');
const express = require('./express-lite');

const PORT = process.env.PORT || 4000;
const DATA_PATH = path.join(__dirname, 'data', 'siteContent.json');
const FRONTEND_PUBLIC_DIR = path.join(__dirname, '..', 'frontend', 'public');
const UPLOAD_DIR = path.join(FRONTEND_PUBLIC_DIR, 'uploads');

function ensureStorage() {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    const seed = {
      hero: {
        title: 'Welcome to the site',
        subtitle: 'Edit this hero section from the dashboard.',
        ctaText: 'Get Started',
        heroImage: ''
      },
      heroSlides: [],
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
      initiatives: [],
      programs: [],
      messages: [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

function loadContent() {
  ensureStorage();
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return {
    ...parsed,
    heroSlides: Array.isArray(parsed.heroSlides) ? parsed.heroSlides : [],
    initiatives: Array.isArray(parsed.initiatives) ? parsed.initiatives : [],
    programs: Array.isArray(parsed.programs) ? parsed.programs : [],
    messages: Array.isArray(parsed.messages) ? parsed.messages : []
  };
}

function saveContent(content) {
  const payload = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2));
  return payload;
}

function sanitizeFileName(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureStorage();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const safeName = sanitizeFileName(file.originalname || 'upload');
    const ext = path.extname(safeName);
    const base = ext ? safeName.slice(0, -ext.length) : safeName;
    const inferredExt =
      ext ||
      (file.mimetype === 'image/png'
        ? '.png'
        : file.mimetype === 'image/webp'
          ? '.webp'
          : '.jpg');

    cb(null, `${Date.now()}-${base}${inferredExt}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error('Only image uploads are allowed (png, jpg, jpeg, webp).'));
      return;
    }
    cb(null, true);
  }
});

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
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/hero', (req, res) => {
  try {
    const content = loadContent();
    const hero = content.hero || {};
    res.json({
      hero: { ...hero, heroImage: hero.heroImage || hero.imageUrl || '' },
      heroSlides: content.heroSlides || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load hero data', error: error.message });
  }
});

app.get('/api/dashboard/content', (req, res) => {
  try {
    const content = loadContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load content', error: error.message });
  }
});

app.get('/api/dashboard/messages', (req, res) => {
  try {
    const content = loadContent();
    res.json({ messages: content.messages || [], updatedAt: content.updatedAt });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load messages', error: error.message });
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

app.post('/api/hero/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'A valid image file is required.' });
    return;
  }

  try {
    ensureStorage();
    const current = loadContent();
    const publicPath = `/uploads/${req.file.filename}`;
    const saved = saveContent({
      ...current,
      hero: { ...current.hero, heroImage: publicPath, imageUrl: publicPath }
    });

    res.json({ url: publicPath, hero: saved.hero });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save hero image', error: error.message });
  }
});

app.post('/api/dashboard/hero/slides', (req, res) => {
  const payload = req.body || {};
  if (!payload.src || !payload.alt) {
    res.status(400).json({ message: 'Slide image and alternative text are required.' });
    return;
  }

  try {
    const content = loadContent();
    const slides = Array.isArray(content.heroSlides) ? [...content.heroSlides] : [];
    const nextId = slides.length ? Math.max(...slides.map((s) => s.id || 0)) + 1 : 1;
    const newSlide = {
      id: nextId,
      title: payload.title || '',
      subtitle: payload.subtitle || '',
      href: payload.href || '',
      src: payload.src,
      alt: payload.alt
    };

    const saved = saveContent({ ...content, heroSlides: [...slides, newSlide] });
    res.json({ slide: newSlide, content: saved });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add slide', error: error.message });
  }
});

app.post('/api/dashboard/initiatives', (req, res) => {
  const payload = req.body || {};
  if (!payload.title || !payload.desc) {
    res.status(400).json({ message: 'Title and description are required for initiatives.' });
    return;
  }

  try {
    const content = loadContent();
    const initiatives = Array.isArray(content.initiatives) ? [...content.initiatives] : [];
    const nextId = initiatives.length ? Math.max(...initiatives.map((i) => i.id || 0)) + 1 : 1;
    const newInitiative = {
      id: nextId,
      tag: payload.tag || 'مبادرة',
      title: payload.title,
      desc: payload.desc,
      amount: payload.amount || ''
    };

    const saved = saveContent({ ...content, initiatives: [...initiatives, newInitiative] });
    res.json({ initiative: newInitiative, content: saved });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add initiative', error: error.message });
  }
});

app.post('/api/dashboard/programs', (req, res) => {
  const payload = req.body || {};
  if (!payload.title || !payload.desc) {
    res.status(400).json({ message: 'Title and description are required for programs.' });
    return;
  }

  try {
    const content = loadContent();
    const programs = Array.isArray(content.programs) ? [...content.programs] : [];
    const nextId = programs.length ? Math.max(...programs.map((p) => p.id || 0)) + 1 : 1;
    const newProgram = {
      id: nextId,
      title: payload.title,
      desc: payload.desc,
      icon: payload.icon || 'Droplet'
    };

    const saved = saveContent({ ...content, programs: [...programs, newProgram] });
    res.json({ program: newProgram, content: saved });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add program', error: error.message });
  }
});

app.post('/api/dashboard/messages', (req, res) => {
  const payload = req.body || {};
  if (!payload.name || !payload.email || !payload.message) {
    res.status(400).json({ message: 'Name, email, and message are required.' });
    return;
  }

  try {
    const content = loadContent();
    const messages = Array.isArray(content.messages) ? [...content.messages] : [];
    const nextId = messages.length ? Math.max(...messages.map((m) => m.id || 0)) + 1 : 1;
    const newMessage = {
      id: nextId,
      name: payload.name,
      email: payload.email,
      topic: payload.topic || 'عام',
      message: payload.message,
      createdAt: new Date().toISOString()
    };

    const saved = saveContent({ ...content, messages: [...messages, newMessage] });
    res.json({ message: 'Message received', entry: newMessage, content: saved });
  } catch (error) {
    res.status(500).json({ message: 'Unable to store message', error: error.message });
  }
});

const server = app.listen(PORT, () => {
  ensureStorage();
  // eslint-disable-next-line no-console
  console.log(`Dashboard backend running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(
      `Port ${PORT} is already in use. Stop the process using that port or set PORT to a free port (e.g. PORT=4100).`
    );
  } else {
    // eslint-disable-next-line no-console
    console.error('Server failed to start:', error.message || error);
  }
  process.exit(1);
});
