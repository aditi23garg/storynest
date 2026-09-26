import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { HomeView } from './views/HomeView';
import { StoriesView } from './views/StoriesView';
import { StoryReaderView } from './views/StoryReaderView';
import { CreateStoryView } from './views/CreateStoryView';
import { INITIAL_STORIES } from './data/storiesData';
import { Story } from './types/story';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'stories' | 'reader' | 'create'>('home');
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [activeStory, setActiveStory] = useState<Story>(INITIAL_STORIES[0]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([
    'elara-celestial-voyage',
    'clockwork-owl-enchanted-willow'
  ]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Scroll to top on view change
  const navigateTo = (view: 'home' | 'stories' | 'create') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadStory = (story: Story) => {
    setActiveStory(story);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadCompanionStory = (storyId: string) => {
    const found = stories.find((s) => s.id === storyId);
    if (found) {
      handleReadStory(found);
    }
  };

  const handleQuickWeave = (prompt: string) => {
    setQuickPrompt(prompt);
    setCurrentView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStoryCreated = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    // automatically bookmark custom creations
    if (!bookmarkedIds.includes(newStory.id)) {
      setBookmarkedIds((prev) => [newStory.id, ...prev]);
    }
  };

  const handleToggleBookmark = (storyId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
  };

  const handleSelectFooterCategory = (cat: string) => {
    setFilterCategory(cat);
    setCurrentView('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bookmarkedStories = stories.filter((s) => bookmarkedIds.includes(s.id));

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex flex-col font-sans selection:bg-[#ffdcbd] selection:text-[#2c1600]">
      {/* Global Application Header */}
      <Header
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarkedCount={bookmarkedIds.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full pt-20">
        {currentView === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            onReadStory={handleReadStory}
            featuredStories={stories}
            onQuickWeave={handleQuickWeave}
          />
        )}

        {currentView === 'stories' && (
          <StoriesView
            stories={stories}
            onReadStory={handleReadStory}
            onNavigateCreate={() => navigateTo('create')}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            initialCategory={filterCategory}
          />
        )}

        {currentView === 'reader' && (
          <StoryReaderView
            story={activeStory}
            onBackToStories={() => navigateTo('stories')}
            onNavigateCreate={() => navigateTo('create')}
            onReadCompanionStory={handleReadCompanionStory}
            isBookmarked={bookmarkedIds.includes(activeStory.id)}
            onToggleBookmark={() => handleToggleBookmark(activeStory.id)}
          />
        )}

        {currentView === 'create' && (
          <CreateStoryView
            onStoryCreated={handleStoryCreated}
            onReadStory={handleReadStory}
            initialPrompt={quickPrompt}
          />
        )}
      </main>

      {/* Global Application Footer (rendered on home, stories, and create pages) */}
      {currentView !== 'reader' && (
        <Footer onSelectCategory={handleSelectFooterCategory} />
      )}

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stories={stories}
        onSelectStory={handleReadStory}
      />

      {/* Saved Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedStories={bookmarkedStories}
        onSelectStory={handleReadStory}
        onRemoveBookmark={handleToggleBookmark}
      />
    </div>
  );
}
