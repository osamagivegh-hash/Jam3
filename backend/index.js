// backend/index.js
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // نستخدم المكتبة الأصلية
const express = require('./express-lite');

const PORT = process.env.PORT || 4100;
const DATA_PATH = path.join(__dirname, 'data', 'siteContent.json');
// مجلد الصور سيكون داخل الباك اند لضمان استقرار الرفع
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// 1. التأكد من وجود المجلدات
function ensureStorage() {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  
  if (!fs.existsSync(DATA_PATH)) {
    // إنشاء ملف بيانات افتراضي إذا لم يوجد
    const seed = {
      hero: { title: 'Welcome', subtitle: '', ctaText: 'Get Started', heroImage: '' },
      heroSlides: [], initiatives: [], programs: [], messages: [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

// 2. دوال تحميل وحفظ البيانات
function loadContent() {
  ensureStorage();
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch (e) { return {}; }
}

function saveContent(content) {
  const payload = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2));
  return payload;
}

// 3. إعداد Multer لحفظ الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureStorage();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // اسم فريد للملف لتجنب التكرار
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// 4. إعداد التطبيق
const app = express();

// السماح للفرونت اند بالاتصال (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());

// *** هام جداً: تقديم مجلد الصور عبر رابط مباشر ***
app.use('/uploads', express.static(UPLOAD_DIR));


// --- API Routes ---

// جلب المحتوى
app.get('/api/dashboard/content', (req, res) => res.json(loadContent()));

// تحديث النصوص
app.put('/api/dashboard/sections', (req, res) => {
  try {
    const current = loadContent();
    const updated = { ...current, ...req.body };
    res.json(saveContent(updated));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// رفع صورة (الهيرو أو غيرها)
app.post('/api/hero/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  // تكوين الرابط الكامل للصورة
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || `localhost:${PORT}`;
  const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  res.json({ url: fullUrl });
});

// إضافة شريحة (Slide) جديدة
app.post('/api/dashboard/hero/slides', (req, res) => {
  const payload = req.body || {};
  const content = loadContent();
  const slides = content.heroSlides || [];
  
  const newSlide = {
    id: Date.now(),
    title: payload.title || '',
    subtitle: payload.subtitle || '',
    href: payload.href || '',
    src: payload.src, // سيحتوي هذا على الرابط الكامل القادم من الرفع
    alt: payload.alt || 'Slide Image'
  };

  const updated = { ...content, heroSlides: [...slides, newSlide] };
  res.json({ slide: newSlide, content: saveContent(updated) });
});

// (يمكنك إضافة بقية الـ APIs للمبادرات والبرامج هنا بنفس النمط...)
// ...

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});