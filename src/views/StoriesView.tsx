import React, { useState, useMemo } from 'react';
import { Story } from '../types/story';
import { STORY_CATEGORIES, AGE_GROUPS } from '../data/storiesData';

interface StoriesViewProps {
  stories: Story[];
  onReadStory: (story: Story) => void;
  onNavigateCreate: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (storyId: string) => void;
  initialCategory?: string;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  stories,
  onReadStory,
  onNavigateCreate,
  bookmarkedIds,
  onToggleBookmark,
  initialCategory = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAge, setSelectedAge] = useState('all');
  const [sortBy, setSortBy] = useState('loved');
  const [localLikes, setLocalLikes] = useState<{ [id: string]: number }>({});

  const handleLike = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    onToggleBookmark(storyId);
    setLocalLikes((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + (bookmarkedIds.includes(storyId) ? -1 : 1)
    }));
  };

  const filteredStories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = stories.filter((story) => {
      const matchesQuery =
        !q ||
        story.title.toLowerCase().includes(q) ||
        story.hero.toLowerCase().includes(q) ||
        story.theme.toLowerCase().includes(q) ||
        story.category.toLowerCase().includes(q) ||
        story.synopsis.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'all' ||
        story.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesAge =
        selectedAge === 'all' ||
        story.ageGroup === selectedAge ||
        story.ageDisplay.includes(selectedAge);

      return matchesQuery && matchesCategory && matchesAge;
    });

    // Sorting
    result.sort((a, b) => {
      const aLikes = a.likesCount + (localLikes[a.id] || 0);
      const bLikes = b.likesCount + (localLikes[b.id] || 0);

      if (sortBy === 'loved') {
        return bLikes - aLikes;
      } else if (sortBy === 'quick') {
        return a.readTimeMinutes - b.readTimeMinutes;
      } else if (sortBy === 'bedtime') {
        const aIsBedtime = a.category === 'bedtime' ? 1 : 0;
        const bIsBedtime = b.category === 'bedtime' ? 1 : 0;
        return bIsBedtime - aIsBedtime;
      }
      return 0; // newest/default
    });

    return result;
  }, [stories, searchQuery, selectedCategory, selectedAge, sortBy, localLikes]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedAge('all');
    setSortBy('loved');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Atmospheric Background Ambient Diffusions */}
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 overflow-hidden">
        <div className="absolute -top-32 right-12 w-96 h-96 rounded-full bg-[#ffdcbd]/30 blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#f1dbff]/20 blur-3xl pointer-events-none -z-10"></div>

        {/* Editorial Sanctuary Header */}
        <header className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ebe8e3] text-[#7d562d] font-label-md text-label-md mb-4 shadow-sm">
            <span className="text-xs">✦</span>
            <span>Illuminated Folio Index</span>
            <span className="text-xs">✦</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-[#080d19] tracking-tight mb-3">
            Explore the Story Sanctuary
          </h1>
          <p className="font-body-lg text-body-lg text-[#45464c] max-w-2xl leading-relaxed">
            Discover hundreds of whimsical fables, cosmic adventures, and gentle bedtime tales crafted under celestial starlight.
          </p>
        </header>

        {/* Interactive Filtering & Search Control Panel */}
        <section className="flex flex-col gap-6 bg-[#f6f3ee] rounded-3xl p-6 lg:p-8 shadow-sm mb-12">
          {/* Search Input + Sort Group */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Live Search Field */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#76777c] text-[22px] pointer-events-none">
                search
              </span>
              <input
                className="w-full pl-12 pr-10 py-3.5 rounded-full bg-[#fcf9f4] text-[#1c1c19] placeholder:text-[#76777c] font-body-md text-body-md shadow-sm transition-all focus:outline-none focus:bg-[#ffffff]"
                placeholder="Search by character name, story title, or keyword..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[#76777c] hover:text-[#1c1c19] hover:bg-[#f0ede9] transition-colors cursor-pointer"
                  title="Clear search"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Sort Select Pill */}
            <div className="flex items-center gap-2 self-end md:self-auto bg-[#fcf9f4] px-4 py-3 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-[#7d562d]">swap_vert</span>
              <label className="font-label-md text-label-md text-[#45464c]">Sort by:</label>
              <select
                className="bg-transparent font-label-lg text-label-lg text-[#080d19] focus:outline-none cursor-pointer pr-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="loved">Most Loved</option>
                <option value="newest">Newest Additions</option>
                <option value="quick">Quick Reads (&lt; 5 min)</option>
                <option value="bedtime">Bedtime Favorites</option>
              </select>
            </div>
          </div>

          {/* Categories Navigation Carousel */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-[#7d562d] uppercase tracking-widest">
                Narrative Realm
              </span>
              <span className="font-label-sm text-label-sm text-[#45464c]">
                {STORY_CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Categories'}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {STORY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#080d19] text-[#ffffff] shadow-sm'
                        : 'bg-[#fcf9f4] text-[#45464c] hover:bg-[#f0ede9] hover:text-[#080d19] shadow-sm'
                    }`}
                    type="button"
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age Group Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#1e2330]/5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="font-label-sm text-label-sm text-[#7d562d] uppercase tracking-widest mr-2 shrink-0">
                Age Group:
              </span>
              {AGE_GROUPS.map((age) => {
                const isActive = selectedAge === age.id;
                return (
                  <button
                    key={age.id}
                    onClick={() => setSelectedAge(age.id)}
                    className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#7d562d] text-[#ffffff] shadow-sm'
                        : 'bg-[#fcf9f4] text-[#45464c] hover:bg-[#f0ede9] hover:text-[#080d19] shadow-sm'
                    }`}
                    type="button"
                  >
                    {age.label}
                  </button>
                );
              })}
            </div>

            {/* Filter Count Pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="w-2 h-2 rounded-full bg-[#7d562d] animate-pulse"></div>
              <span className="font-label-lg text-label-lg text-[#080d19]">
                Showing {filteredStories.length} tale{filteredStories.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </section>

        {/* Story Catalog Cards Grid */}
        <section>
          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story) => {
                const isBookmarked = bookmarkedIds.includes(story.id);
                const currentLikes = story.likesCount + (localLikes[story.id] || 0);

                return (
                  <article
                    key={story.id}
                    onClick={() => onReadStory(story)}
                    className="group flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#ebe8e3]">
                      <img
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        src={story.coverImage}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080d19]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                      {/* Category & Age Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#18002f]/80 backdrop-blur-md text-[#f1dbff] font-label-md text-label-md shadow-sm">
                          ✦ {story.theme}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#ffffff]/90 backdrop-blur-md text-[#1c1c19] font-label-sm text-label-sm shadow-sm">
                          {story.ageDisplay}
                        </span>
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        aria-label="Add to bedtime bookmarks"
                        onClick={(e) => handleLike(e, story.id)}
                        className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-[#ffffff]/90 backdrop-blur-md flex items-center justify-center transition-all shadow-sm cursor-pointer hover:scale-110 ${
                          isBookmarked ? 'text-[#ba1a1a]' : 'text-[#45464c] hover:text-[#ba1a1a]'
                        }`}
                        type="button"
                      >
                        <span
                          className={`material-symbols-outlined text-[19px] ${
                            isBookmarked ? 'fill' : ''
                          }`}
                        >
                          favorite
                        </span>
                      </button>

                      {/* Character Badge Pill */}
                      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2330]/85 backdrop-blur-md text-[#ffdcbd] font-label-sm text-label-sm shadow-sm">
                        <span className="material-symbols-outlined text-[15px] text-[#ffdcbd]">
                          auto_awesome
                        </span>
                        <span>{story.hero}</span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 font-label-sm text-label-sm text-[#7d562d] mb-1">
                          <span>{story.readTimeMinutes} min reading journey</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-[#45464c]">
                            <span className="material-symbols-outlined text-[14px] text-[#7d562d]">
                              favorite
                            </span>{' '}
                            {currentLikes.toLocaleString()}
                          </span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-[#080d19] group-hover:text-[#7d562d] transition-colors leading-snug">
                          {story.title}
                        </h2>
                        <p className="font-body-sm text-body-sm text-[#45464c] mt-2 line-clamp-2">
                          {story.synopsis}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-[#f0ede9]">
                        <span className="inline-flex items-center gap-1 font-label-lg text-label-lg text-[#080d19] group-hover:text-[#7d562d] group-hover:translate-x-1 transition-all">
                          <span>Read Tale</span>
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </span>
                        <span className="font-label-sm text-label-sm text-[#76777c]">
                          {story.badge || 'Illustrated Book'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* No Stories Found Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#f6f3ee] rounded-3xl mt-4">
              <div className="w-16 h-16 rounded-full bg-[#e5e2dd] flex items-center justify-center text-[#7d562d] mb-4 shadow-inner">
                <span className="material-symbols-outlined text-[32px]">auto_stories</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-[#080d19] mb-2">
                No stories found in this realm
              </h3>
              <p className="font-body-md text-body-md text-[#45464c] max-w-md mb-6">
                The stars couldn't pinpoint any tales matching your current filters. Try relaxing your search terms or exploring all categories.
              </p>
              <button
                className="px-6 py-2.5 rounded-full bg-[#080d19] text-[#ffffff] font-label-lg text-label-lg shadow-sm hover:scale-105 transition-all cursor-pointer"
                onClick={resetAllFilters}
                type="button"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* Bottom Call to Action Banner */}
        <section className="mt-16 bg-[#1e2330] text-[#ffffff] rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#7d562d]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#370061]/40 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-label-sm text-label-sm text-[#ffdcbd] uppercase tracking-widest block mb-2">
                Infinite Story Forge
              </span>
              <h2 className="font-headline-md text-headline-md text-[#ffffff] leading-tight mb-2">
                Have a specific character in mind?
              </h2>
              <p className="font-body-md text-body-md text-[#858a9a]">
                Weave their tailor-made bedtime fable, enchanted adventure, or cosmic escapade in seconds with our narrative studio.
              </p>
            </div>
            <button
              onClick={onNavigateCreate}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#7d562d] text-[#ffffff] font-label-lg text-label-lg shadow-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
            >
              <span>✨</span>
              <span>Create Your Story</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
