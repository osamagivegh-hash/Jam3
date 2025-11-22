const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const PORT = process.env.PORT || 4100;

// ==========================
//  Paths
// ==========================
const DATA_PATH = path.join(__dirname, "data", "siteContent.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

// ==========================
//  Ensure Storage
// ==========================
function ensureStorage() {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  if (!fs.existsSync(DATA_PATH)) {
    const seed = {
      hero: { title: "Welcome", subtitle: "", ctaText: "Get Started", heroImage: "" },
      heroSlides: [],
      initiatives: [],
      programs: [],
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

function loadContent() {
  ensureStorage();
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function saveContent(content) {
  const payload = { ...content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2));
  return payload;
}

// ==========================
//  Multer Setup
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureStorage();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(
      file.originalname
    )}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// ==========================
//  Express App
// ==========================
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR)); // ← يعمل الآن بدون مشاكل

// ==========================
//  API Routes
// ==========================

// ---- Load Full Content ----
app.get("/api/dashboard/content", (req, res) => {
  res.json(loadContent());
});

// ---- Upload Hero Image ----
app.post("/api/hero/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: fullUrl });
});

// ---- Hero Slides ----
app.post("/api/dashboard/hero/slides", (req, res) => {
  const body = req.body || {};
  const data = loadContent();
  const slides = data.heroSlides || [];

  const slide = {
    id: Date.now(),
    title: body.title || "",
    subtitle: body.subtitle || "",
    href: body.href || "",
    src: body.src,
    alt: body.alt || "Slide",
  };

  const updated = { ...data, heroSlides: [...slides, slide] };
  res.json({ slide, content: saveContent(updated) });
});

// ---- Initiatives ----
app.post("/api/dashboard/initiatives", (req, res) => {
  const b = req.body || {};
  const data = loadContent();
  const initiatives = data.initiatives || [];

  const item = {
    id: Date.now(),
    tag: b.tag || "مبادرة",
    title: b.title,
    desc: b.desc,
    amount: b.amount,
  };

  const updated = { ...data, initiatives: [...initiatives, item] };
  res.json({ initiative: item, content: saveContent(updated) });
});

// ---- Programs ----
app.post("/api/dashboard/programs", (req, res) => {
  const b = req.body || {};
  const data = loadContent();
  const programs = data.programs || [];

  const item = {
    id: Date.now(),
    title: b.title,
    desc: b.desc,
    icon: b.icon || "Droplet",
  };

  const updated = { ...data, programs: [...programs, item] };
  res.json({ program: item, content: saveContent(updated) });
});

// ---- Messages ----
app.post("/api/dashboard/messages", (req, res) => {
  const b = req.body || {};
  const data = loadContent();
  const messages = data.messages || [];

  const msg = {
    id: Date.now(),
    name: b.name,
    email: b.email,
    topic: b.topic || "عام",
    message: b.message,
    createdAt: new Date().toISOString(),
  };

  const updated = { ...data, messages: [...messages, msg] };
  res.json({ entry: msg, content: saveContent(updated) });
});

// ---- Update Sections ----
app.put("/api/dashboard/sections", (req, res) => {
  try {
    const incoming = req.body || {};
    const current = loadContent();

    const updated = {
      ...current,
      hero: incoming.hero
        ? { ...current.hero, ...incoming.hero }
        : current.hero,
      sections: incoming.sections
        ? { ...current.sections, ...incoming.sections }
        : current.sections,
    };

    res.json(saveContent(updated));
  } catch (err) {
    res.status(400).json({ message: "Unable to save", error: err.message });
  }
});

// ==========================
//  Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
