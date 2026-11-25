const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5006;

app.use(cors());
app.use(express.json());

// MongoDB Schema
const SubmissionSchema = new mongoose.Schema({
  response: {
    type: String,
    required: true,
    enum: ['Yes', 'No', 'Pending'],
    default: 'Pending',
  },
  loginName: {
    type: String,
    default: '',
  },
  quizAnswers: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  noAttempts: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: String,
  ipAddress: String,
});

const Submission = mongoose.model('Submission', SubmissionSchema);

// Track DB status & fallback store when DB isn't reachable
let dbConnected = false;
const memoryStore = [];

const mongoUri =
  process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/state_lab_db';
mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    dbConnected = true;
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    dbConnected = false;
    console.warn('MongoDB unreachable, using in-memory fallback store:', err.message);
  });

mongoose.connection.on('connected', () => {
  dbConnected = true;
});

mongoose.connection.on('disconnected', () => {
  dbConnected = false;
});

function sanitizeQuizAnswers(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const cleaned = {};
  for (const [key, value] of Object.entries(raw)) {
    const cleanKey = String(key || '').trim();
    const cleanVal = String(value ?? '').trim();
    if (cleanKey && cleanVal) {
      cleaned[cleanKey] = cleanVal;
    }
  }
  return cleaned;
}

// Health & Root Routes
app.get('/', (req, res) => {
  res.json({ ok: true, dbConnected, service: 'state-lab-api' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, dbConnected });
});

// Save or update response + quiz answers + loginName
app.post('/api/response', async (req, res) => {
  try {
    const {
      id,
      response = 'Pending',
      loginName = '',
      quizAnswers = {},
      noAttempts = 0,
    } = req.body || {};

    if (!['Yes', 'No', 'Pending'].includes(response)) {
      return res.status(400).json({ error: 'Valid response (Yes/No/Pending) is required.' });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const cleanQuiz = sanitizeQuizAnswers(quizAnswers);
    const cleanLogin = String(loginName || '').trim();
    const cleanAttempts = Number(noAttempts) || 0;

    if (dbConnected) {
      if (id && mongoose.Types.ObjectId.isValid(id)) {
        const existing = await Submission.findById(id);
        if (existing) {
          existing.response = response;
          if (cleanLogin) existing.loginName = cleanLogin;
          existing.quizAnswers = {
            ...(existing.quizAnswers && typeof existing.quizAnswers === 'object'
              ? existing.quizAnswers
              : {}),
            ...cleanQuiz,
          };
          existing.noAttempts = Math.max(Number(existing.noAttempts) || 0, cleanAttempts);
          existing.timestamp = new Date();
          existing.ipAddress = String(ipAddress);
          existing.userAgent = String(userAgent);
          existing.markModified('quizAnswers');
          await existing.save();

          return res.status(200).json({
            success: true,
            storage: 'mongodb',
            data: existing,
          });
        }
      }

      const doc = new Submission({
        response,
        loginName: cleanLogin,
        quizAnswers: cleanQuiz,
        noAttempts: cleanAttempts,
        message: '',
        ipAddress: String(ipAddress),
        userAgent: String(userAgent),
        timestamp: new Date(),
      });
      await doc.save();
      return res.status(201).json({
        success: true,
        storage: 'mongodb',
        data: doc,
      });
    }

    if (id) {
      const memItem = memoryStore.find((item) => item._id === id);
      if (memItem) {
        memItem.response = response;
        if (cleanLogin) memItem.loginName = cleanLogin;
        memItem.quizAnswers = { ...(memItem.quizAnswers || {}), ...cleanQuiz };
        memItem.noAttempts = Math.max(Number(memItem.noAttempts) || 0, cleanAttempts);
        memItem.timestamp = new Date();
        return res.status(200).json({
          success: true,
          storage: 'memory',
          data: memItem,
        });
      }
    }

    const memDoc = {
      _id: crypto.randomUUID(),
      response,
      loginName: cleanLogin,
      quizAnswers: cleanQuiz,
      noAttempts: cleanAttempts,
      message: '',
      ipAddress: String(ipAddress),
      userAgent: String(userAgent),
      timestamp: new Date(),
    };
    memoryStore.unshift(memDoc);
    return res.status(201).json({
      success: true,
      storage: 'memory',
      data: memDoc,
    });
  } catch (error) {
    console.error('Error saving response:', error);
    return res.status(500).json({ error: 'Failed to save response.' });
  }
});

// Update message on existing response (or create fallback record if missing)
app.post('/api/response/message', async (req, res) => {
  try {
    const { id, message, loginName = '', quizAnswers = {} } = req.body || {};

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Non-empty message is required.' });
    }

    const trimmedMessage = String(message).trim();
    const cleanLogin = String(loginName || '').trim();
    const cleanQuiz = sanitizeQuizAnswers(quizAnswers);
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    if (dbConnected) {
      if (id && mongoose.Types.ObjectId.isValid(id)) {
        const existing = await Submission.findById(id);
        if (existing) {
          existing.message = trimmedMessage;
          if (cleanLogin && !existing.loginName) existing.loginName = cleanLogin;
          if (Object.keys(cleanQuiz).length > 0) {
            existing.quizAnswers = {
              ...(existing.quizAnswers && typeof existing.quizAnswers === 'object'
                ? existing.quizAnswers
                : {}),
              ...cleanQuiz,
            };
            existing.markModified('quizAnswers');
          }
          await existing.save();

          return res.status(200).json({
            success: true,
            storage: 'mongodb',
            data: existing,
          });
        }
      }

      const fallbackDoc = new Submission({
        response: 'Yes',
        loginName: cleanLogin,
        quizAnswers: cleanQuiz,
        noAttempts: 0,
        message: trimmedMessage,
        ipAddress: String(ipAddress),
        userAgent: String(userAgent),
        timestamp: new Date(),
      });
      await fallbackDoc.save();
      return res.status(201).json({
        success: true,
        storage: 'mongodb',
        data: fallbackDoc,
      });
    }

    if (id) {
      const memItem = memoryStore.find((item) => item._id === id);
      if (memItem) {
        memItem.message = trimmedMessage;
        if (cleanLogin && !memItem.loginName) memItem.loginName = cleanLogin;
        if (Object.keys(cleanQuiz).length > 0) {
          memItem.quizAnswers = { ...(memItem.quizAnswers || {}), ...cleanQuiz };
        }
        return res.status(200).json({
          success: true,
          storage: 'memory',
          data: memItem,
        });
      }
    }

    const memFallback = {
      _id: crypto.randomUUID(),
      response: 'Yes',
      loginName: cleanLogin,
      quizAnswers: cleanQuiz,
      noAttempts: 0,
      message: trimmedMessage,
      ipAddress: String(ipAddress),
      userAgent: String(userAgent),
      timestamp: new Date(),
    };
    memoryStore.unshift(memFallback);
    return res.status(201).json({
      success: true,
      storage: 'memory',
      data: memFallback,
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return res.status(500).json({ error: 'Failed to update message.' });
  }
});

// Delete a submission by id (used for cleanup if needed)
app.delete('/api/response/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (dbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Submission.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Submission not found.' });
      }
      return res.json({ success: true, storage: 'mongodb' });
    }
    const idx = memoryStore.findIndex((item) => item._id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Submission not found.' });
    }
    memoryStore.splice(idx, 1);
    return res.json({ success: true, storage: 'memory' });
  } catch (error) {
    console.error('Error deleting response:', error);
    return res.status(500).json({ error: 'Failed to delete response.' });
  }
});

// Fetch all responses (newest first)
app.get('/api/response', async (req, res) => {
  try {
    if (dbConnected) {
      const responses = await Submission.find().sort({ timestamp: -1 });
      return res.json({
        success: true,
        storage: 'mongodb',
        count: responses.length,
        data: responses,
      });
    }

    return res.json({
      success: true,
      storage: 'memory',
      count: memoryStore.length,
      data: memoryStore,
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return res.status(500).json({ error: 'Failed to fetch responses.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`state-lab-api listening on port ${PORT}`);
  });
}

module.exports = { app, Submission };
