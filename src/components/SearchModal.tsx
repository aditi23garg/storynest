import React, { useState } from 'react';
import { Story } from '../types/story';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stories,
  onSelectStory
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = stories.filter((story) => {
    const q = query.toLowerCase();
    return (
      story.title.toLowerCase().includes(q) ||
      story.hero.toLowerCase().includes(q) ||
      story.theme.toLowerCase().includes(q) ||
      story.category.toLowerCase().includes(q) ||
      story.synopsis.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#080d19]/60 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#ffffff] rounded-3xl shadow-2xl border border-[#1e2330]/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0ede9]">
          <span className="material-symbols-outlined text-[#7d562d] text-[24px]">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search characters, magical items, realms..."
            className="flex-1 bg-transparent text-[#1c1c19] text-base font-body-md focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#76777c] hover:text-[#1c1c19] text-sm font-label-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#76777c] hover:bg-[#f0ede9] hover:text-[#1c1c19] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {filtered.length > 0 ? (
            filtered.map((story) => (
              <div
                key={story.id}
                onClick={() => {
                  onSelectStory(story);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#f6f3ee] transition-all cursor-pointer group"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm text-[#7d562d] uppercase font-bold tracking-wider">
                      {story.theme}
                    </span>
                    <span className="text-[#c6c6cc]">·</span>
                    <span className="font-label-sm text-label-sm text-[#45464c]">
                      {story.ageDisplay}
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-[1.1rem] text-[#080d19] group-hover:text-[#7d562d] transition-colors truncate">
                    {story.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-[#45464c] truncate">
                    Hero: {story.hero} · {story.readTimeMinutes} min read
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#76777c] group-hover:text-[#7d562d] group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-[#45464c]">
              <span className="material-symbols-outlined text-[36px] text-[#7d562d] mb-2">
                auto_stories
              </span>
              <p className="font-headline-sm text-headline-sm text-[#080d19]">No tales found</p>
              <p className="font-body-sm text-body-sm">
                Try searching for "Elara", "Owl", "Dragon", or "Starlight".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
