import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Heart, Frown, Smile, Meh, Calendar, Sparkles } from 'lucide-react';
import { JournalEntry } from '../api/journalAPI';

interface EntryCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
  delay?: number;
}

const moodIcons = {
  happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
  sad: { icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50' },
  anxious: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  neutral: { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50' },
  excited: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
  reflective: { icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50' },
};

export default function EntryCard({ entry, onDelete, delay = 0 }: EntryCardProps) {
  const [showFullText, setShowFullText] = useState(false);
  
  const moodConfig = moodIcons[entry.mood.toLowerCase() as keyof typeof moodIcons] || moodIcons.neutral;
  const MoodIcon = moodConfig.icon;
  
  const truncatedText = entry.text.length > 200 ? entry.text.substring(0, 200) + '...' : entry.text;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${moodConfig.bg}`}>
              <MoodIcon className={`h-5 w-5 ${moodConfig.color}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium capitalize ${moodConfig.color}`}>
                  {entry.mood}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(entry.createdAt), 'h:mm a')}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => onDelete(entry._id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {showFullText ? entry.text : truncatedText}
          </p>
          {entry.text.length > 200 && (
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-2"
            >
              {showFullText ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        {entry.summary && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border-l-4 border-primary-500">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">AI Summary</span>
            </div>
            <p className="text-sm text-gray-700">{entry.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}