import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Journal text is required'],
    minlength: [10, 'Journal entry must be at least 10 characters'],
    maxlength: [5000, 'Journal entry cannot exceed 5000 characters']
  },
  summary: {
    type: String,
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'neutral', 'excited', 'reflective', 'angry', 'calm'],
    default: 'neutral'
  },
  aiAnalysis: {
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    keywords: [String],
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
journalEntrySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('JournalEntry', journalEntrySchema);