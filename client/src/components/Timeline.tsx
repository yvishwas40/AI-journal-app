import React from 'react';
import { JournalEntry } from '../api/journalAPI';
import EntryCard from './EntryCard';
import { Calendar, Clock } from 'lucide-react';

interface TimelineProps {
  entries: JournalEntry[];
  onDeleteEntry: (id: string) => void;
  loading?: boolean;
}

export default function Timeline({ entries, onDeleteEntry, loading = false }: TimelineProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries yet</h3>
          <p className="text-gray-600">
            Start journaling to see your entries appear here. Your AI-powered insights await!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-primary-500" />
        <h2 className="text-xl font-semibold text-gray-900">Your Journal Timeline</h2>
      </div>
      
      {entries.map((entry, index) => (
        <EntryCard
          key={entry._id}
          entry={entry}
          onDelete={onDeleteEntry}
          delay={index * 100}
        />
      ))}
    </div>
  );
}