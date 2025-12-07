import React, { useState } from 'react';
import { Button } from './Button';

interface StartScreenProps {
  onStart: (subject: string) => void;
  isLoading: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim()) {
      onStart(subject);
    }
  };

  const suggestions = ["Cyberpunk Alley", "Haunted Space Station", "Ancient Desert Temple", "Noir Detective Office"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 z-50 relative bg-black/80 backdrop-blur-sm">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-700">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            STORY
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Narrative Depth Engine</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter a subject..."
              className="relative w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-lg placeholder-gray-600"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!subject.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                Dreaming...
              </span>
            ) : "Enter The Void"}
          </Button>
        </form>

        {!isLoading && (
          <div className="pt-8">
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Or try a preset</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className="text-xs border border-gray-800 hover:border-gray-500 rounded-full px-3 py-1 text-gray-400 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Ambient background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};