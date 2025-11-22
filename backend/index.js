const fs = require('fs');
const path = require('path');
const express = require('./express-lite');

const PORT = process.env.PORT || 4000;
const DATA_PATH = path.join(__dirname, 'data', 'siteContent.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

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
      heroSlides: [
        {
          id: 1,
          src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
          alt: 'أسر تتلقى الدعم في الميدان',
          title: 'نصل إلى العائلات الأشد احتياجاً بكرامة',
          subtitle: 'فرقنا الميدانية تعمل بمعايير سلامة وجودة لتعزيز أثر عطائكم.',
          href: '#initiatives'
        },
        {
          id: 2,
          src: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80',
          alt: 'متطوعون يقدمون خدمات تعليمية',
          title: 'برامج تعليمية وتمكينية رائدة',
          subtitle: 'نصمم محتوى يلهم الأطفال والشباب ليصنعوا مستقبلهم.',
          href: '#programs'
        },
        {
          id: 3,
          src: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80',
          alt: 'مياه نقية تصل للقرى',
          title: 'مشروعات مياه مستدامة',
          subtitle: 'شبكات مياه وبِنى تحتية تحافظ على صحة الأسر والقرى.',
          href: '#impact'
        }
      ],
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
app.use('/uploads', express.static(UPLOAD_DIR));

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
