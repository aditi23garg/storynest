import React from 'react';

interface HeaderProps {
  currentView: 'home' | 'stories' | 'reader' | 'create';
  onNavigate: (view: 'home' | 'stories' | 'create') => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  bookmarkedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenBookmarks,
  bookmarkedCount
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#fcf9f4]/90 backdrop-blur-xl border-b border-[#1e2330]/5 shadow-[0_1px_12px_rgba(30,35,48,0.05)]">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <img
              alt="StoryNest Logo"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmlO2wgsA1Nw4nSrLGQfQ992_MEqrz3NyxDKAajF6VWM8fhkzwbkRkHWwARSkvOR_8o6M9Wl7H6AAf_1eMfjXy3eVCV4vqUjBAe7IR5_czkOG0T5pyRbQaB9o1jcIaPfQI_MZN3J42NoNgns1-3W7UYKXqY9f7k89w5U1ewcnW4bPA_VW6X_S6wc2hGdHfkFNj8nvQW7eUgEH3ZeVke6263B829v-NTf9q7eCBqn5KgOHMMXrwFOhK"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#080d19] tracking-tight">
                StoryNest
              </span>
              <span className="font-label-sm text-label-sm text-[#7d562d] tracking-widest uppercase">
                Tails &amp; Wonder
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#f6f3ee] rounded-full border border-[#1e2330]/5">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-[#f0ede9] text-[#080d19] font-bold shadow-sm'
                  : 'text-[#45464c] hover:text-[#1c1c19] hover:bg-[#f0ede9]/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('stories')}
              className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                currentView === 'stories' || currentView === 'reader'
                  ? 'bg-[#f0ede9] text-[#080d19] font-bold shadow-sm'
                  : 'text-[#45464c] hover:text-[#1c1c19] hover:bg-[#f0ede9]/60'
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => onNavigate('create')}
              className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                currentView === 'create'
                  ? 'bg-[#f0ede9] text-[#080d19] font-bold shadow-sm'
                  : 'text-[#45464c] hover:text-[#1c1c19] hover:bg-[#f0ede9]/60'
              }`}
            >
              Create Story
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('create')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e2330] text-[#ffffff] font-label-lg text-label-lg shadow-[0_0_16px_rgba(212,163,115,0.3)] hover:scale-[1.02] hover:bg-[#080d19] transition-all cursor-pointer"
          >
            <span className="text-[#ffdcbd] text-sm">✦</span>
            <span>Create Story</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#45464c] hover:bg-[#f0ede9] hover:text-[#1c1c19] transition-colors cursor-pointer"
            title="Search stories"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#45464c] hover:bg-[#f0ede9] hover:text-[#1c1c19] transition-colors cursor-pointer"
            title="Saved bookmarks"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            {bookmarkedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#7d562d] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {bookmarkedCount}
              </span>
            )}
          </button>

          <div
            className="w-8 h-8 rounded-full bg-[#080d19] flex items-center justify-center shadow-sm select-none"
            title="Starlight Keeper Account"
          >
            <span className="material-symbols-outlined text-[#ffffff] text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
