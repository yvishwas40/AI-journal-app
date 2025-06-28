import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { PenTool, Sparkles, Send } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

interface JournalEditorProps {
  onSubmit: (text: string) => void;
  loading?: boolean;
}

export default function JournalEditor({ onSubmit, loading = false }: JournalEditorProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      // Remove HTML tags for API submission
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      onSubmit(textContent);
      setContent('');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
          <PenTool className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Write Your Thoughts</h2>
        <Sparkles className="h-5 w-5 text-secondary-500" />
      </div>
      
      <div className="mb-4">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="What's on your mind today? Share your thoughts, feelings, and experiences..."
          className="bg-white"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          AI will analyze your entry for mood and generate a summary
        </p>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>{loading ? 'Analyzing...' : 'Submit Entry'}</span>
        </button>
      </div>
    </div>
  );
}