import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import JournalEditor from '../components/JournalEditor';
import Timeline from '../components/Timeline';
import { journalAPI, JournalEntry } from '../api/journalAPI';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await journalAPI.getEntries();
      setEntries(response.data.entries);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEntry = async (text: string) => {
    setSubmitting(true);
    try {
      const response = await journalAPI.createEntry(text);
      setEntries([response.data.entry, ...entries]);
      setShowEditor(false);
    } catch (error) {
      console.error('Failed to create entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await journalAPI.deleteEntry(id);
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Ready to capture your thoughts and let AI provide insights?
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchEntries}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Entry</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Journal Editor */}
        {showEditor && (
          <JournalEditor
            onSubmit={handleSubmitEntry}
            loading={submitting}
          />
        )}

        {/* Timeline */}
        <Timeline
          entries={entries}
          onDeleteEntry={handleDeleteEntry}
          loading={loading}
        />
      </div>
    </div>
  );
}