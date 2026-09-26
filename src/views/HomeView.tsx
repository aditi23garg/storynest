import React, { useState } from 'react';
import { Story } from '../types/story';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'stories' | 'create') => void;
  onReadStory: (story: Story) => void;
  featuredStories: Story[];
  onQuickWeave: (prompt: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onReadStory,
  featuredStories,
  onQuickWeave
}) => {
  const [inspirationPrompt, setInspirationPrompt] = useState(
    'A curious hedgehog who collects fallen stardust...'
  );
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter 3 cards based on selectedFilter
  const filteredStories = featuredStories.filter((story) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Bedtime') return story.category === 'bedtime';
    if (selectedFilter === 'Fantasy & Magic')
      return story.category === 'fantasy' || story.category === 'fairy tale';
    if (selectedFilter === 'Curious Adventures')
      return story.category === 'adventure' || story.category === 'sci-fi';
    if (selectedFilter === 'Gentle Lessons')
      return story.category === 'friendship' || story.category === 'moral';
    return true;
  });

  const elaraStory =
    featuredStories.find((s) => s.id === 'elara-celestial-voyage') || featuredStories[0];

  return (
    <div className="flex flex-col w-full">
      {/* Subtle Celestial Ambient Aura Behind Hero */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#ffdcbd]/30 via-[#deb7ff]/20 to-transparent blur-3xl pointer-events-none rounded-full opacity-60"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#ffca98]/20 blur-3xl pointer-events-none rounded-full"></div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-16 lg:pt-14 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typography & Story Hook */}
            <div className="lg:col-span-6 flex flex-col gap-6 relative z-10">
              {/* Overline Badge */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#ebe8e3]/80 text-[#7d562d] shadow-sm">
                <span className="text-xs">✦</span>
                <span className="font-label-md text-label-md tracking-wider uppercase font-semibold">
                  The Sanctum of Living Tales
                </span>
              </div>

              {/* Main Tagline & Subheading */}
              <div className="space-y-4">
                <h1 className="font-headline-xl text-headline-xl text-[#080d19] tracking-tight leading-tight">
                  Every character has a story{' '}
                  <span className="italic font-normal text-[#7d562d]">waiting to be told.</span>
                </h1>
                <p className="font-body-lg text-body-lg text-[#45464c] max-w-xl">
                  Where bedtime tales, whimsical sagas, and childhood adventures spring to life. Create customized storybooks or explore enchanting tales crafted for curious minds.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('create')}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#1e2330] text-[#ffffff] font-label-lg text-label-lg shadow-[0_4px_24px_rgba(212,163,115,0.35)] hover:scale-[1.02] hover:bg-[#080d19] transition-all cursor-pointer"
                >
                  <span className="text-[#ffdcbd] text-base">✦</span>
                  <span>Create Your Story</span>
                </button>
                <button
                  onClick={() => onNavigate('stories')}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#f0ede9] hover:bg-[#e5e2dd] text-[#1c1c19] font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px] text-[#7d562d]">
                    auto_stories
                  </span>
                  <span>Explore Library</span>
                </button>
              </div>

              {/* Proof Metrics Bar */}
              <div className="pt-6 mt-4 grid grid-cols-3 gap-4 border-t-0 bg-[#f6f3ee]/70 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-[#080d19]">50,000+</span>
                  <span className="font-label-sm text-label-sm text-[#45464c] mt-0.5">Stories woven</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-[#080d19]">Ages 3–18</span>
                  <span className="font-label-sm text-label-sm text-[#45464c] mt-0.5">Curated wonder</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-headline-sm text-headline-sm text-[#080d19]">4.9</span>
                    <span className="text-[#7d562d] text-xs">★★★★★</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#45464c] mt-0.5">Keeper rating</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Grand Book Presentation */}
            <div className="lg:col-span-6 relative z-10 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none group">
                {/* Atmospheric back glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#7d562d]/20 via-[#deb7ff]/25 to-[#ffca98]/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Book Artwork & Floating Metadata Module */}
                <div className="relative bg-[#ffffff] rounded-3xl shadow-[0_20px_50px_rgba(30,35,48,0.12)] p-4 sm:p-5 overflow-hidden transition-all duration-500 hover:-translate-y-1">
                  {/* Cover Image Display with Ornamental Ribbon */}
                  <div
                    className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-[#f0ede9] cursor-pointer"
                    onClick={() => onReadStory(elaraStory)}
                  >
                    <img
                      alt="Elara's Celestial Voyage: The Firefly Astronomer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      src={elaraStory.coverImage}
                    />
                    {/* Floating Editor Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#080d19]/80 backdrop-blur-md text-[#ffffff] font-label-sm text-label-sm flex items-center gap-1.5 shadow-md">
                      <span className="text-[#ffdcbd] text-xs">✦</span>
                      <span>Editor's Story of the Month</span>
                    </div>
                    {/* Subtle bottom gradient scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080d19]/80 via-[#080d19]/30 to-transparent pointer-events-none"></div>
                    {/* Read preview action overlay on image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#ffffff]">
                      <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-[#e5e2dd]/20 backdrop-blur-md">
                        Age 6–8 · Fantasy &amp; Starlight
                      </span>
                      <div className="flex items-center gap-1 font-label-sm text-label-sm text-[#ffdcbd]">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>7 min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata & Quick Controls */}
                  <div className="mt-4 pt-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-[#080d19] tracking-tight">
                          Elara's Celestial Voyage
                        </h2>
                        <p className="font-body-sm text-body-sm text-[#45464c] italic mt-0.5">
                          The Firefly Astronomer • Character: Elara (Age 8)
                        </p>
                      </div>
                      <button
                        onClick={() => onReadStory(elaraStory)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffdcbd]/50 hover:bg-[#ffdcbd] text-[#2c1600] font-label-sm text-label-sm transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">headphones</span>
                        <span>Audio Tale</span>
                      </button>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#45464c] line-clamp-2">
                      High atop a mossy floating island, Elara points her brass spyglass toward the shimmering constellations, searching for the fireflies that ignite the nocturnal sky.
                    </p>

                    {/* Action Button in Card */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <div className="flex items-center -space-x-1.5 text-xs text-[#45464c]">
                        <div className="w-6 h-6 rounded-full bg-[#ffca98] flex items-center justify-center font-bold text-[#2c1600] text-[10px]">
                          L
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#e5e2dd] flex items-center justify-center font-bold text-[#1c1c19] text-[10px]">
                          M
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#080d19] flex items-center justify-center font-bold text-[#ffffff] text-[10px]">
                          ✦
                        </div>
                        <span className="pl-3 font-label-sm text-label-sm text-[#45464c]">
                          420 young keepers read today
                        </span>
                      </div>
                      <button
                        onClick={() => onReadStory(elaraStory)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#080d19] text-[#ffffff] hover:bg-[#1e2330] font-label-md text-label-md transition-all shadow-sm cursor-pointer"
                      >
                        <span>Begin Reading</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Inspiration Sandbox Hook */}
      <section className="w-full bg-[#f6f3ee] py-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto bg-[#ffffff] rounded-3xl p-6 sm:p-10 shadow-[0_8px_32px_rgba(30,35,48,0.06)] relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#ffdcbd]/20 pointer-events-none blur-2xl"></div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col gap-2 max-w-md">
              <div className="flex items-center gap-2 text-[#7d562d]">
                <span className="text-sm">✦</span>
                <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">
                  Immediate Inspiration
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-[#080d19]">
                What will your hero discover tonight?
              </h2>
              <p className="font-body-sm text-body-sm text-[#45464c]">
                Test a concept. Tap an idea or craft your own tiny premise to generate a bespoke bedside tale.
              </p>
            </div>

            {/* Mini Interactive Prompt Bar */}
            <div className="flex-1 w-full lg:max-w-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-[#f0ede9] rounded-2xl p-1.5 shadow-inner">
                <span className="material-symbols-outlined text-[#7d562d] ml-3">magic_button</span>
                <input
                  className="w-full bg-transparent px-2 py-2 text-[#1c1c19] font-body-sm text-body-sm placeholder:text-[#45464c]/60 focus:outline-none"
                  type="text"
                  value={inspirationPrompt}
                  onChange={(e) => setInspirationPrompt(e.target.value)}
                  placeholder="Describe your dream character & setting..."
                />
                <button
                  onClick={() => onQuickWeave(inspirationPrompt)}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-[#080d19] text-[#ffffff] font-label-md text-label-md hover:bg-[#1e2330] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span>Weave</span>
                  <span className="material-symbols-outlined text-[16px]">spark</span>
                </button>
              </div>

              {/* Quick Suggestion Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-label-sm text-label-sm text-[#45464c]">Try:</span>
                <button
                  className="px-3 py-1 rounded-full bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#45464c] hover:text-[#2c1600] font-label-sm text-label-sm transition-colors cursor-pointer"
                  onClick={() =>
                    setInspirationPrompt('A clockmaker kitten who pauses the moon')
                  }
                  type="button"
                >
                  Clockmaker kitten
                </button>
                <button
                  className="px-3 py-1 rounded-full bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#45464c] hover:text-[#2c1600] font-label-sm text-label-sm transition-colors cursor-pointer"
                  onClick={() =>
                    setInspirationPrompt('A quiet boy who paints friendly sea creatures')
                  }
                  type="button"
                >
                  Painter under the sea
                </button>
                <button
                  className="px-3 py-1 rounded-full bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#45464c] hover:text-[#2c1600] font-label-sm text-label-sm transition-colors cursor-pointer"
                  onClick={() =>
                    setInspirationPrompt('A tiny owl searching for the morning sun')
                  }
                  type="button"
                >
                  Owl seeker
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section: "Treasured Chronicles" */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#7d562d] pb-1">
              <span className="text-xs">✦</span>
              <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">
                Curated Library
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-[#080d19] tracking-tight">
              Treasured Chronicles
            </h2>
            <p className="font-body-md text-body-md text-[#45464c] mt-1">
              Hand-crafted tales ready to spark curiosity, bravery, and peaceful rest tonight.
            </p>
          </div>

          {/* Quick Genre Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Bedtime', 'Fantasy & Magic', 'Curious Adventures', 'Gentle Lessons'].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  className={`px-4 py-2 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                    selectedFilter === category
                      ? 'bg-[#080d19] text-[#ffffff] shadow-sm'
                      : 'bg-[#f0ede9] hover:bg-[#e5e2dd] text-[#45464c]'
                  }`}
                  type="button"
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.slice(0, 3).map((story) => (
            <article
              key={story.id}
              className="flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(30,35,48,0.06)] hover:shadow-[0_16px_40px_rgba(30,35,48,0.12)] transition-all duration-300 group cursor-pointer"
              onClick={() => onReadStory(story)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f0ede9]">
                <img
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  src={story.coverImage}
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#080d19]/80 backdrop-blur-md text-[#ffffff] font-label-sm text-label-sm">
                  {story.badge || 'Staff Pick'}
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#fcf9f4]/90 backdrop-blur-md text-[#1c1c19] font-label-sm text-label-sm shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#7d562d]">
                    menu_book
                  </span>
                  <span>{story.readTimeMinutes} Min</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffdcbd] text-[#2c1600] font-label-sm text-label-sm font-semibold">
                      {story.theme}
                    </span>
                    <span className="font-label-sm text-label-sm text-[#45464c]">
                      {story.ageDisplay}
                    </span>
                    <span className="text-[#45464c]/40">•</span>
                    <span className="font-label-sm text-label-sm text-[#7d562d] truncate">
                      {story.hero}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-[#080d19] group-hover:text-[#7d562d] transition-colors">
                    {story.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-[#45464c] line-clamp-3">
                    {story.synopsis}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t-0 bg-[#f6f3ee]/60 rounded-xl px-4 py-2.5">
                  <span className="font-label-sm text-label-sm text-[#45464c] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#7d562d]">
                      auto_stories
                    </span>
                    <span>{story.pageCount} Illustrated Pages</span>
                  </span>
                  <span className="font-label-md text-label-md text-[#080d19] group-hover:text-[#7d562d] flex items-center gap-1 font-semibold transition-colors">
                    <span>Read Story</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Discover More Tales Row */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('stories')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#1c1c19] font-label-lg text-label-lg transition-all shadow-sm cursor-pointer"
          >
            <span>View Full Library (140+ Stories)</span>
            <span className="material-symbols-outlined text-[18px]">explore</span>
          </button>
        </div>
      </section>

      {/* "How Magic Is Woven" 3-Step Process */}
      <section className="w-full bg-[#f6f3ee] py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Intro */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-[#7d562d]">
              <span className="text-xs">✦</span>
              <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">
                The Alchemical Craft
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-[#080d19] tracking-tight">
              How Magic Is Woven
            </h2>
            <p className="font-body-md text-body-md text-[#45464c]">
              In three deliberate steps, create a personalized keepsake illustrated book made specifically for your listener.
            </p>
          </div>

          {/* 3 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative bg-[#ffffff] rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#ffdcbd]/50 flex items-center justify-center text-[#2c1600]">
                  <span className="material-symbols-outlined text-[24px]">face</span>
                </div>
                <span className="font-headline-md text-headline-md text-[#dcdad5] font-bold">
                  01
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline-sm text-headline-sm text-[#080d19]">Choose Your Hero</h3>
                <p className="font-body-sm text-body-sm text-[#45464c]">
                  Give your hero a beloved name, a funny quirk (like mismatched socks or pocket acorns), and an earnest wish to fulfill.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e5e2dd]/60 flex items-center gap-2 text-[#7d562d] font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Personalized protagonist</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-[#ffffff] rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#ffca98] flex items-center justify-center text-[#7a532a]">
                  <span className="material-symbols-outlined text-[24px]">public</span>
                </div>
                <span className="font-headline-md text-headline-md text-[#dcdad5] font-bold">
                  02
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline-sm text-headline-sm text-[#080d19]">Select Age &amp; Realm</h3>
                <p className="font-body-sm text-body-sm text-[#45464c]">
                  Match the vocabulary, rhythmic cadence, and bedtime calmness precisely to their developmental milestone.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e5e2dd]/60 flex items-center gap-2 text-[#7d562d] font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Tailored reading level</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-[#ffffff] rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#1e2330] flex items-center justify-center text-[#ffffff]">
                  <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                </div>
                <span className="font-headline-md text-headline-md text-[#dcdad5] font-bold">
                  03
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline-sm text-headline-sm text-[#080d19]">Weave in Seconds</h3>
                <p className="font-body-sm text-body-sm text-[#45464c]">
                  Receive full color page illustrations, soothing prose, and optional soft audio narration crafted to enchant.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e5e2dd]/60 flex items-center gap-2 text-[#7d562d] font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Ready for bed tonight</span>
              </div>
            </div>
          </div>

          {/* Action Banner inside Steps */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-[#080d19] text-[#ffffff] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10 space-y-1 text-center sm:text-left">
              <h4 className="font-headline-sm text-headline-sm text-[#ffffff]">
                Have a hero in mind right now?
              </h4>
              <p className="font-body-sm text-body-sm text-[#ffffff]/80">
                Begin crafting a custom saga in less than two minutes.
              </p>
            </div>
            <button
              onClick={() => onNavigate('create')}
              className="relative z-10 shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ffdcbd] text-[#2c1600] font-label-lg text-label-lg shadow-md hover:bg-[#f0bd8b] transition-all cursor-pointer font-bold"
            >
              <span>Launch Creator</span>
              <span className="material-symbols-outlined text-[18px]">magic_button</span>
            </button>
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#7d562d]/30 blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Editorial Testimonial / Storyteller Endorsement */}
      <section className="w-full max-w-5xl mx-auto px-6 lg:px-12 py-20 text-center flex flex-col items-center">
        <span className="font-headline-xl text-headline-xl text-[#7d562d] leading-none">“</span>
        <blockquote className="font-headline-md text-headline-md text-[#080d19] italic max-w-3xl -mt-4 leading-relaxed">
          Reading StoryNest before sleep has transformed bedtime from a battle against the clock into our favorite shared adventure under the stars.
        </blockquote>
        <div className="mt-6 flex flex-col items-center gap-1">
          <span className="font-label-lg text-label-lg text-[#080d19] font-bold">
            Claire &amp; Oliver (Age 6)
          </span>
          <span className="font-body-sm text-body-sm text-[#45464c]">
            Devoted Starlight Keepers • Cambridge, UK
          </span>
        </div>
      </section>
    </div>
  );
};
