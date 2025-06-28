import express from 'express';
import { createEntry, getEntries, getEntry, deleteEntry } from '../controllers/journalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(createEntry)
  .get(getEntries);

router.route('/:id')
  .get(getEntry)
  .delete(deleteEntry);

export default router;