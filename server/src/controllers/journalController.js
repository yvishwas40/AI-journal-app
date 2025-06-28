import JournalEntry from '../models/JournalEntry.js';
import { analyzeEntry } from '../services/geminiService.js';

export const createEntry = async (req, res, next) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Journal entry must be at least 10 characters long'
      });
    }

    // Analyze the entry with Gemini AI
    let summary = '';
    let mood = 'neutral';
    let aiAnalysis = {};

    try {
      const analysis = await analyzeEntry(text);
      summary = analysis.summary || '';
      mood = analysis.mood || 'neutral';
      aiAnalysis = {
        confidence: analysis.confidence || 0.5,
        keywords: analysis.keywords || [],
        sentiment: analysis.sentiment || 'neutral'
      };
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Continue without AI analysis if it fails
    }

    const entry = await JournalEntry.create({
      userId,
      text: text.trim(),
      summary,
      mood,
      aiAnalysis
    });

    await entry.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      entry
    });
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const entries = await JournalEntry.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    const total = await JournalEntry.countDocuments({ userId });

    res.status(200).json({
      success: true,
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const entry = await JournalEntry.findOne({ _id: id, userId })
      .populate('userId', 'name email');

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    res.status(200).json({
      success: true,
      entry
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const entry = await JournalEntry.findOneAndDelete({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};