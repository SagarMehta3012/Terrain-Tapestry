import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Simple in-memory rate limit (per IP, resets on restart) to curb spam
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 5;
  const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

// Fallback storage: append to a local file if email isn't configured
const MESSAGES_FILE = path.join(__dirname, 'messages.log.json');
function saveMessageLocally(entry) {
  let arr = [];
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      arr = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    }
  } catch (_) { arr = []; }
  arr.push(entry);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(arr, null, 2));
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

app.post('/api/contact', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    if (rateLimited(ip)) {
      return res.status(429).json({ error: 'Too many messages — please try again in a minute.' });
    }

    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are all required.' });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return res.status(400).json({ error: 'One of the fields is too long.' });
    }

    const entry = { name, email, message, receivedAt: new Date().toISOString(), ip };

    const transporter = getTransporter();
    const CONTACT_TO = process.env.CONTACT_TO || process.env.SMTP_USER;

    if (transporter && CONTACT_TO) {
      await transporter.sendMail({
        from: `"Terrain Tapestry Website" <${process.env.SMTP_USER}>`,
        to: CONTACT_TO,
        replyTo: email,
        subject: `New message from ${name} — Terrain Tapestry`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } else {
      // No SMTP configured yet — store locally so nothing is lost.
      saveMessageLocally(entry);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Could not send your message right now. Please try again later.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// SPA-style fallback to index for unknown routes (single page site)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Terrain Tapestry server running on port ${PORT}`);
});
