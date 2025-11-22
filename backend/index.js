const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('./express-lite');

//////////////////////////////////////////////////////////
//  🔥 المنفذ الجديد (تم إصلاحه) — يستخدم 4100 دائماً
//////////////////////////////////////////////////////////
const PORT = process.env.PORT || 4100;

//////////////////////////////////////////////////////////
//  🔧 المسارات الأساسية
//////////////////////////////////////////////////////////
const DATA_PATH = path.join(__dirname, 'data', 'siteContent.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

//////////////////////////////////////////////////////////
//  🗂 إنشاء المجلدات الأساسية عند الحاجة
//////////////////////////////////////////////////////////
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
        about: { heading: 'About', content: 'Share your story and mission.' },
        services: { heading: 'Services', content: 'List the main services or initiatives here.' },
        contact: { heading: 'Contact', content: 'Provide ways for visitors to reach you.' }
      },
      initiatives: [],
      programs: [],
      messages: [],
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

//////////////////////////////////////////////////////////
//  📦 تحميل المحتوى
//////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////
//  💾 حفظ المحتوى
//////////////////////////////////////////////////////////
function saveContent(content) {
  const payload = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2));
  return payload;
}

function buildFileUrl(req, filename) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || `localhost:${PORT}`;
  return `${protocol}://${host}/uploads/${filename}`;
}

//////////////////////////////////////////////////////////
//  🧹 تنظيف أسماء الملفات
//////////////////////////////////////////////////////////
function sanitizeFileName(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

//////////////////////////////////////////////////////////
//  📁 إعدادات Multer لرفع الصور
//////////////////////////////////////////////////////////
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error('Only image uploads are allowed (png, jpg, jpeg, webp).'));
      return;
    }
    cb(null, true);
  }
});

//////////////////////////////////////////////////////////
//  🚀 إنشاء السيرفر Express-lite
//////////////////////////////////////////////////////////
const app = express();

//////////////////////////////////////////////////////////
//  🌐 CORS
//////////////////////////////////////////////////////////
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());
app.use('/uploads', (req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method)) return next();

  const relativePath = req.path.replace(/^\/uploads\/?/, '');
  if (!relativePath) return next();

  const filePath = path.join(UPLOAD_DIR, relativePath);
  if (!filePath.startsWith(UPLOAD_DIR)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.status(500).json({ message: 'File stream error' }));
    stream.pipe(res);
  });
});

//////////////////////////////////////////////////////////
//  📌 API — بيانات الهيرو + الشرائح
//////////////////////////////////////////////////////////
app.get('/api/hero', (req, res) => {
  try {
    const content = loadContent();
    const hero = content.hero || {};
    res.json({
      hero: {
        ...hero,
        heroImage: hero.heroImage || hero.imageUrl || ''
      },
      heroSlides: content.heroSlides || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load hero data', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — المحتوى الكامل
//////////////////////////////////////////////////////////
app.get('/api/dashboard/content', (req, res) => {
  try {
    res.json(loadContent());
  } catch (error) {
    res.status(500).json({ message: 'Unable to load content', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — الرسائل
//////////////////////////////////////////////////////////
app.get('/api/dashboard/messages', (req, res) => {
  try {
    const content = loadContent();
    res.json({ messages: content.messages, updatedAt: content.updatedAt });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load messages', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — تحديث الأقسام
//////////////////////////////////////////////////////////
app.put('/api/dashboard/sections', (req, res) => {
  try {
    const incoming = req.body || {};
    const current = loadContent();

    const updated = {
      ...current,
      hero: incoming.hero ? { ...current.hero, ...incoming.hero } : current.hero,
      sections: incoming.sections ? { ...current.sections, ...incoming.sections } : current.sections
    };

    res.json(saveContent(updated));
  } catch (error) {
    res.status(400).json({ message: 'Unable to save updates', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — رفع صورة الهيرو
//////////////////////////////////////////////////////////
app.post('/api/hero/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'A valid image file is required.' });

  try {
    const content = loadContent();
    const fullUrl = buildFileUrl(req, req.file.filename);

    const saved = saveContent({
      ...content,
      hero: { ...content.hero, heroImage: fullUrl, imageUrl: fullUrl }
    });

    res.json({ url: fullUrl, hero: saved.hero });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save hero image', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — إضافة شريحة هيرو
//////////////////////////////////////////////////////////
app.post('/api/dashboard/hero/slides', (req, res) => {
  const payload = req.body || {};
  if (!payload.src || !payload.alt)
    return res.status(400).json({ message: 'Slide image and alternative text are required.' });

  try {
    const content = loadContent();
    const slides = [...content.heroSlides];
    const nextId = slides.length ? Math.max(...slides.map((s) => s.id)) + 1 : 1;

    const newSlide = {
      id: nextId,
      title: payload.title || '',
      subtitle: payload.subtitle || '',
      href: payload.href || '',
      src: payload.src,
      alt: payload.alt
    };

    res.json({ slide: newSlide, content: saveContent({ ...content, heroSlides: [...slides, newSlide] }) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add slide', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — المبادرات
//////////////////////////////////////////////////////////
app.post('/api/dashboard/initiatives', (req, res) => {
  const payload = req.body || {};

  if (!payload.title || !payload.desc)
    return res.status(400).json({ message: 'Title and description are required for initiatives.' });

  try {
    const content = loadContent();
    const initiatives = [...content.initiatives];
    const nextId = initiatives.length ? Math.max(...initiatives.map((i) => i.id)) + 1 : 1;

    const newInitiative = {
      id: nextId,
      tag: payload.tag || 'مبادرة',
      title: payload.title,
      desc: payload.desc,
      amount: payload.amount || ''
    };

    res.json({ initiative: newInitiative, content: saveContent({ ...content, initiatives: [...initiatives, newInitiative] }) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add initiative', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — البرامج
//////////////////////////////////////////////////////////
app.post('/api/dashboard/programs', (req, res) => {
  const payload = req.body || {};

  if (!payload.title || !payload.desc)
    return res.status(400).json({ message: 'Title and description are required for programs.' });

  try {
    const content = loadContent();
    const programs = [...content.programs];
    const nextId = programs.length ? Math.max(...programs.map((p) => p.id)) + 1 : 1;

    const newProgram = {
      id: nextId,
      title: payload.title,
      desc: payload.desc,
      icon: payload.icon || 'Droplet'
    };

    res.json({ program: newProgram, content: saveContent({ ...content, programs: [...programs, newProgram] }) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add program', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  📌 API — الرسائل
//////////////////////////////////////////////////////////
app.post('/api/dashboard/messages', (req, res) => {
  const payload = req.body || {};

  if (!payload.name || !payload.email || !payload.message)
    return res.status(400).json({ message: 'Name, email, and message are required.' });

  try {
    const content = loadContent();
    const messages = [...content.messages];
    const nextId = messages.length ? Math.max(...messages.map((m) => m.id)) + 1 : 1;

    const newMessage = {
      id: nextId,
      name: payload.name,
      email: payload.email,
      topic: payload.topic || 'عام',
      message: payload.message,
      createdAt: new Date().toISOString()
    };

    res.json({
      message: 'Message received',
      entry: newMessage,
      content: saveContent({ ...content, messages: [...messages, newMessage] })
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to store message', error: error.message });
  }
});

//////////////////////////////////////////////////////////
//  🚀 تشغيل السيرفر
//////////////////////////////////////////////////////////
const server = app.listen(PORT, () => {
  ensureStorage();
  console.log(`Dashboard backend running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server failed to start:', error.message);
  }
  process.exit(1);
});
