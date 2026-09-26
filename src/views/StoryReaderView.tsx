import React, { useState, useEffect, useRef } from 'react';
import { Story } from '../types/story';

interface StoryReaderViewProps {
  story: Story;
  onBackToStories: () => void;
  onNavigateCreate: () => void;
  onReadCompanionStory: (storyId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({
  story,
  onBackToStories,
  onNavigateCreate,
  onReadCompanionStory,
  isBookmarked,
  onToggleBookmark
}) => {
  // Reading typography and mode settings
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
  const [isSerif, setIsSerif] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [audioProgress, setAudioProgress] = useState(55); // percentage for visual scrubber
  const audioIntervalRef = useRef<number | null>(null);

  // Reactions
  const [reactions, setReactions] = useState({
    loved: 482,
    bedtime: 891,
    wonder: 623,
    companions: 314
  });
  const [userReactions, setUserReactions] = useState<{ [k: string]: boolean }>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const current = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
        setScrollProgress(current);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Audio ticker simulation
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = window.setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    } else if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio]);

  const toggleReaction = (type: 'loved' | 'bedtime' | 'wonder' | 'companions') => {
    const hasReacted = userReactions[type];
    setUserReactions((prev) => ({ ...prev, [type]: !hasReacted }));
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + (hasReacted ? -1 : 1)
    }));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-500 ${
        isNightMode ? 'bg-[#18002f] text-[#fcf9f4]' : 'bg-[#fcf9f4] text-[#1c1c19]'
      }`}
    >
      {/* Interactive Sticky Reading Controls & Story Trail Bar */}
      <div
        className={`sticky top-20 z-40 w-full backdrop-blur-md shadow-sm transition-all duration-300 ${
          isNightMode
            ? 'bg-[#18002f]/90 border-b border-[#f1dbff]/10'
            : 'bg-[#fcf9f4]/90 border-b border-[#1e2330]/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Back Link & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBackToStories}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md font-label-md transition-transform duration-200 hover:-translate-x-0.5 cursor-pointer ${
                isNightMode
                  ? 'bg-[#370061] text-[#ffffff] hover:bg-[#370061]/80'
                  : 'bg-[#f0ede9] text-[#1c1c19] hover:bg-[#ebe8e3]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span className="hidden sm:inline">Back to Stories</span>
              <span className="sm:hidden">Stories</span>
            </button>
            <div
              className={`hidden md:flex items-center gap-1.5 text-label-sm font-label-sm truncate ${
                isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
              }`}
            >
              <span>Sanctum</span>
              <span className="text-[#7d562d]/60">/</span>
              <span
                onClick={onBackToStories}
                className="hover:text-[#7d562d] transition-colors cursor-pointer"
              >
                {story.theme}
              </span>
              <span className="text-[#7d562d]/60">/</span>
              <span className={`truncate font-semibold ${isNightMode ? 'text-white' : 'text-[#080d19]'}`}>
                {story.title}
              </span>
            </div>
          </div>

          {/* Reading Utilities + Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Font Size Adjusters */}
            <div
              className={`flex items-center rounded-full p-0.5 shadow-sm ${
                isNightMode ? 'bg-[#370061]' : 'bg-[#f6f3ee]'
              }`}
            >
              <button
                onClick={() =>
                  setFontSizeMultiplier((prev) => Math.max(0.85, Number((prev - 0.1).toFixed(2))))
                }
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors text-label-sm font-label-sm cursor-pointer"
                title="Decrease font size"
                type="button"
              >
                A-
              </button>
              <button
                onClick={() =>
                  setFontSizeMultiplier((prev) => Math.min(1.35, Number((prev + 0.1).toFixed(2))))
                }
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors text-label-md font-label-md font-bold cursor-pointer"
                title="Increase font size"
                type="button"
              >
                A+
              </button>
            </div>

            {/* Typography Family Toggle (Serif vs Sans) */}
            <button
              onClick={() => setIsSerif(!isSerif)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-label-sm transition-colors cursor-pointer ${
                isNightMode
                  ? 'bg-[#370061] text-[#ffffff] hover:bg-[#370061]/80'
                  : 'bg-[#f6f3ee] text-[#1c1c19] hover:bg-[#f0ede9]'
              }`}
              title="Switch reading typeface"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">font_download</span>
              <span>{isSerif ? 'Serif' : 'Sans'}</span>
            </button>

            {/* Starlight / Parchment Mode Toggle */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isNightMode
                  ? 'bg-[#ffca98] text-[#2c1600]'
                  : 'bg-[#f6f3ee] hover:bg-[#ffdcbd] text-[#1c1c19]'
              }`}
              title={isNightMode ? 'Switch to daylight parchment' : 'Switch to celestial night canvas'}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isNightMode ? 'light_mode' : 'bedtime'}
              </span>
            </button>

            {/* Bookmark Toggle */}
            <button
              onClick={onToggleBookmark}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-[#ffca98] text-[#7a532a]'
                  : isNightMode
                  ? 'bg-[#370061] text-[#ffffff]'
                  : 'bg-[#f6f3ee] hover:bg-[#f0ede9] text-[#1c1c19]'
              }`}
              title={isBookmarked ? 'Saved in library' : 'Save tale to collection'}
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${isBookmarked ? 'fill' : ''}`}>
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>

            {/* Primary CTA: Create Another Tale */}
            <button
              onClick={onNavigateCreate}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1e2330] text-[#ffffff] text-label-sm font-label-sm shadow-[0_0_14px_rgba(212,163,115,0.35)] hover:bg-[#080d19] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span className="text-[#ffdcbd] text-xs">✨</span>
              <span className="hidden sm:inline">Create Another</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Reading Progress Ribbon */}
        <div className="w-full h-1 bg-[#f0ede9]">
          <div
            className="h-full bg-gradient-to-r from-[#f0bd8b] via-[#7d562d] to-[#deb7ff] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Story Hero & Metadata Showcase */}
      <section
        className={`relative w-full overflow-hidden pb-12 pt-8 sm:pt-12 transition-colors duration-500 ${
          isNightMode
            ? 'bg-gradient-to-b from-[#18002f] via-[#1e2330] to-[#18002f]'
            : 'bg-gradient-to-b from-[#f6f3ee] via-[#fcf9f4] to-[#fcf9f4]'
        }`}
      >
        <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#ffca98]/20 blur-3xl"></div>
        <div className="pointer-events-none absolute top-1/3 right-10 w-80 h-80 rounded-full bg-[#deb7ff]/30 blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Story Book Cover Showcase Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="group relative w-full max-w-sm">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#ffca98]/60 via-[#ffdcbd] to-[#deb7ff] rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Book Artwork Canvas */}
                <div className="relative rounded-2xl overflow-hidden bg-[#e5e2dd] shadow-2xl shadow-[#080d19]/20 aspect-[3/4] flex items-center justify-center">
                  <img
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={story.readingImage || story.coverImage}
                  />
                  {/* Decorative corner glyphs */}
                  <div className="absolute top-3 left-3 text-[#ffdcbd] text-xs pointer-events-none select-none drop-shadow">
                    ✦
                  </div>
                  <div className="absolute top-3 right-3 text-[#ffdcbd] text-xs pointer-events-none select-none drop-shadow">
                    ✦
                  </div>
                  <div className="absolute bottom-3 left-3 text-[#ffdcbd] text-xs pointer-events-none select-none drop-shadow">
                    ✦
                  </div>
                  <div className="absolute bottom-3 right-3 text-[#ffdcbd] text-xs pointer-events-none select-none drop-shadow">
                    ✦
                  </div>
                </div>

                {/* Floating Stardust Pill */}
                <div className="absolute -bottom-4 right-4 bg-[#ffffff]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-label-sm font-label-sm text-[#7d562d]">
                  <span className="material-symbols-outlined text-[16px] text-[#7d562d]">
                    auto_awesome
                  </span>
                  <span>Bedtime Favorite</span>
                </div>
              </div>
            </div>

            {/* Story Metadata & Header Intro */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Badges & Realm Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1dbff] text-[#2d0050] text-label-sm font-label-sm">
                  <span className="text-xs">✦</span>
                  {story.theme}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#ebe8e3] text-[#45464c] text-label-sm font-label-sm">
                  {story.ageDisplay}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] text-label-sm font-label-sm">
                  {story.readTimeMinutes} min read • {story.wordCount.toLocaleString()} words
                </span>
              </div>

              {/* Main Title */}
              <div className="flex flex-col gap-2">
                <span className="text-label-md font-label-md tracking-widest uppercase text-[#7d562d] font-bold">
                  The Chronicles of Sol-Aria
                </span>
                <h1
                  className={`font-headline-xl text-headline-xl leading-tight ${
                    isNightMode ? 'text-[#ffffff]' : 'text-[#080d19]'
                  }`}
                >
                  {story.title}
                </h1>
                <p className="font-headline-sm text-headline-sm text-[#7d562d] font-medium">
                  {story.subtitle}
                </p>
              </div>

              {/* Celestial Epigraph / Quote */}
              {story.epigraph && (
                <div className="relative pl-5 py-2 my-1">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7d562d] rounded-full"></div>
                  <p className="font-headline-sm text-headline-sm italic text-[#7d562d] leading-snug">
                    “{story.epigraph.quote}”
                  </p>
                  <span className="block mt-1 font-label-sm text-label-sm opacity-80 uppercase tracking-wider">
                    — {story.epigraph.author}
                  </span>
                </div>
              )}

              {/* Character Pill Detail */}
              <div
                className={`flex items-center gap-3 p-3 rounded-2xl max-w-md ${
                  isNightMode ? 'bg-[#370061]/60' : 'bg-[#f6f3ee]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#ffca98] flex items-center justify-center text-[#7a532a]">
                  <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#7d562d] uppercase font-bold tracking-wider">
                    Protagonist
                  </span>
                  <span className="font-body-md text-body-md font-medium">
                    {story.hero} {story.companion ? `& ${story.companion}` : ''}
                  </span>
                </div>
              </div>

              {/* Audio Narrator Widget */}
              <div
                className={`mt-2 p-4 rounded-2xl shadow-sm flex flex-col gap-3 max-w-xl ${
                  isNightMode ? 'bg-[#1e2330] border border-[#f1dbff]/10' : 'bg-[#f0ede9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7d562d] text-[20px]">
                      graphic_eq
                    </span>
                    <span className="font-label-md text-label-md font-bold">Audio Read-Aloud</span>
                    <span
                      className={`text-label-sm font-label-sm px-2 py-0.5 rounded-full ${
                        isNightMode ? 'bg-[#370061] text-[#ffffff]' : 'bg-[#e5e2dd] text-[#45464c]'
                      }`}
                    >
                      Voiced by {story.audioVoicedBy}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#76777c]">
                    04:18 / {story.audioDuration}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-[#080d19] text-[#ffffff] flex items-center justify-center hover:bg-[#1e2330] transition-transform hover:scale-105 shadow-sm cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {isPlayingAudio ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  {/* Progress bar scrubber */}
                  <div
                    className="flex-1 flex flex-col gap-1 cursor-pointer group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      setAudioProgress(Math.min(100, Math.max(0, (clickX / rect.width) * 100)));
                    }}
                  >
                    <div
                      className={`h-2 w-full rounded-full overflow-hidden relative ${
                        isNightMode ? 'bg-[#370061]' : 'bg-[#e5e2dd]'
                      }`}
                    >
                      <div
                        className="h-full bg-[#7d562d] rounded-full relative group-hover:bg-[#f0bd8b] transition-all"
                        style={{ width: `${audioProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* Speed Pill */}
                  <button
                    onClick={() => {
                      if (audioSpeed === '1.0x') setAudioSpeed('1.25x');
                      else if (audioSpeed === '1.25x') setAudioSpeed('1.5x');
                      else setAudioSpeed('1.0x');
                    }}
                    className={`px-2.5 py-1 rounded-full text-label-sm font-label-sm transition-colors cursor-pointer ${
                      isNightMode
                        ? 'bg-[#370061] text-white hover:bg-[#370061]/80'
                        : 'bg-[#e5e2dd] text-[#1c1c19] hover:bg-[#ebe8e3]'
                    }`}
                    type="button"
                  >
                    {audioSpeed}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Reading Sanctuary Canvas */}
      <main className="w-full py-12 transition-colors duration-500">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <article
            className={`p-6 sm:p-12 md:p-16 rounded-3xl shadow-xl flex flex-col gap-10 transition-colors duration-500 ${
              isNightMode
                ? 'bg-[#1e2330] text-[#fcf9f4] shadow-black/40 border border-[#f1dbff]/10'
                : 'bg-[#ffffff] text-[#1c1c19] shadow-[#080d19]/5'
            }`}
          >
            {story.chapters.map((chapter, idx) => (
              <React.Fragment key={idx}>
                <section className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#7d562d] font-bold">
                      {chapter.number}
                    </span>
                    <div
                      className={`h-px flex-1 ${
                        isNightMode ? 'bg-[#370061]' : 'bg-[#e5e2dd]'
                      }`}
                    ></div>
                    <span className="text-[#f0bd8b] text-xs">✦ ✦ ✦</span>
                  </div>

                  <h2
                    className={`font-headline-lg text-headline-lg ${
                      isNightMode ? 'text-[#ffffff]' : 'text-[#080d19]'
                    }`}
                  >
                    {chapter.title}
                  </h2>

                  <div
                    className="leading-relaxed space-y-5"
                    style={{
                      fontFamily: isSerif
                        ? '"Playfair Display", Georgia, serif'
                        : '"Plus Jakarta Sans", system-ui, sans-serif',
                      fontSize: `${1.125 * fontSizeMultiplier}rem`,
                      lineHeight: `${1.875 * fontSizeMultiplier * 1.1}rem`
                    }}
                  >
                    {chapter.content.map((paragraph, pIdx) => {
                      if (pIdx === 0 && idx === 0) {
                        const firstChar = paragraph[0];
                        const restOfParagraph = paragraph.slice(1);
                        return (
                          <p key={pIdx}>
                            <span className="float-left text-[4.5rem] leading-[3.75rem] font-headline-xl text-[#7d562d] pr-4 pt-1 font-serif select-none drop-shadow-sm">
                              {firstChar}
                            </span>
                            {restOfParagraph}
                          </p>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>
                </section>

                {/* Optional Artifact from Chapter */}
                {chapter.artifact && (
                  <div
                    className={`my-4 rounded-2xl overflow-hidden p-4 flex flex-col sm:flex-row items-center gap-6 shadow-sm ${
                      isNightMode ? 'bg-[#370061]/50 border border-[#f1dbff]/10' : 'bg-[#f0ede9]'
                    }`}
                  >
                    <div className="w-full sm:w-48 h-40 rounded-xl overflow-hidden shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        alt={chapter.artifact.title}
                        src={chapter.artifact.image}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#7d562d] font-semibold">
                        {chapter.artifact.caption}
                      </span>
                      <h4
                        className={`font-headline-sm text-headline-sm ${
                          isNightMode ? 'text-[#ffffff]' : 'text-[#080d19]'
                        }`}
                      >
                        {chapter.artifact.title}
                      </h4>
                      <p
                        className={`font-body-sm text-body-sm ${
                          isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
                        }`}
                      >
                        {chapter.artifact.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Optional Quote from Chapter */}
                {chapter.quote && (
                  <div
                    className={`relative p-6 sm:p-8 rounded-2xl shadow-sm ${
                      isNightMode ? 'bg-[#370061]/40 border-l-4 border-[#ffdcbd]' : 'bg-[#f6f3ee]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-[#7d562d] font-headline-xl text-[3rem] leading-none select-none">
                        “
                      </span>
                      <div className="flex flex-col gap-2">
                        <p className="font-headline-sm text-headline-sm italic text-[#7d562d] leading-snug">
                          {chapter.quote.text}
                        </p>
                        <span
                          className={`font-label-md text-label-md ${
                            isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
                          }`}
                        >
                          — {chapter.quote.author}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Bedtime Story Bookmark Flourish */}
            <div className="pt-8 border-t-0 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-1 bg-[#f0bd8b] rounded-full"></div>
              <p className="font-headline-sm text-headline-sm italic text-[#7d562d]">
                Goodnight, quiet stargazer. May your dreams sail safe across the night.
              </p>
              <span
                className={`font-label-sm text-label-sm uppercase tracking-widest font-bold ${
                  isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
                }`}
              >
                The End • Tale #142 of StoryNest
              </span>
            </div>
          </article>
        </div>
      </main>

      {/* Post-Reading Action Sanctuary & Delight Reactions */}
      <section
        className={`w-full py-16 px-6 lg:px-12 transition-colors duration-500 ${
          isNightMode ? 'bg-[#18002f]' : 'bg-[#f6f3ee]'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
          {/* Interactive Reaction Emojis */}
          <div
            className={`w-full p-8 rounded-3xl shadow-md flex flex-col items-center text-center gap-6 ${
              isNightMode ? 'bg-[#1e2330] text-white border border-[#f1dbff]/10' : 'bg-[#ffffff]'
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#7d562d] font-bold">
                Share Your Wonder
              </span>
              <h3
                className={`font-headline-md text-headline-md ${
                  isNightMode ? 'text-white' : 'text-[#080d19]'
                }`}
              >
                How did this tale make you feel?
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => toggleReaction('loved')}
                className={`px-4 py-2.5 rounded-full transition-all flex items-center gap-2 text-label-md font-label-md shadow-sm group cursor-pointer ${
                  userReactions.loved
                    ? 'bg-[#ffdcbd] text-[#2c1600]'
                    : isNightMode
                    ? 'bg-[#370061] text-white hover:bg-[#ffdcbd] hover:text-[#2c1600]'
                    : 'bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#1c1c19]'
                }`}
                type="button"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">❤️</span>
                <span>Loved It</span>
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isNightMode ? 'bg-black/20 text-white' : 'bg-[#ebe8e3] text-[#45464c]'
                  }`}
                >
                  {reactions.loved.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => toggleReaction('bedtime')}
                className={`px-4 py-2.5 rounded-full transition-all flex items-center gap-2 text-label-md font-label-md shadow-sm group cursor-pointer ${
                  userReactions.bedtime
                    ? 'bg-[#ffdcbd] text-[#2c1600]'
                    : isNightMode
                    ? 'bg-[#370061] text-white hover:bg-[#ffdcbd] hover:text-[#2c1600]'
                    : 'bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#1c1c19]'
                }`}
                type="button"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">🌙</span>
                <span>Perfect Bedtime</span>
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isNightMode ? 'bg-black/20 text-white' : 'bg-[#ebe8e3] text-[#45464c]'
                  }`}
                >
                  {reactions.bedtime.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => toggleReaction('wonder')}
                className={`px-4 py-2.5 rounded-full transition-all flex items-center gap-2 text-label-md font-label-md shadow-sm group cursor-pointer ${
                  userReactions.wonder
                    ? 'bg-[#ffdcbd] text-[#2c1600]'
                    : isNightMode
                    ? 'bg-[#370061] text-white hover:bg-[#ffdcbd] hover:text-[#2c1600]'
                    : 'bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#1c1c19]'
                }`}
                type="button"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">🌟</span>
                <span>Wonder-filled</span>
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isNightMode ? 'bg-black/20 text-white' : 'bg-[#ebe8e3] text-[#45464c]'
                  }`}
                >
                  {reactions.wonder.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => toggleReaction('companions')}
                className={`px-4 py-2.5 rounded-full transition-all flex items-center gap-2 text-label-md font-label-md shadow-sm group cursor-pointer ${
                  userReactions.companions
                    ? 'bg-[#ffdcbd] text-[#2c1600]'
                    : isNightMode
                    ? 'bg-[#370061] text-white hover:bg-[#ffdcbd] hover:text-[#2c1600]'
                    : 'bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#1c1c19]'
                }`}
                type="button"
              >
                <span className="text-xl group-hover:scale-125 transition-transform">🦉</span>
                <span>Charming Companions</span>
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isNightMode ? 'bg-black/20 text-white' : 'bg-[#ebe8e3] text-[#45464c]'
                  }`}
                >
                  {reactions.companions.toLocaleString()}
                </span>
              </button>
            </div>

            <div
              className={`flex items-center gap-4 text-body-sm ${
                isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
              }`}
            >
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1 hover:text-[#7d562d] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span>{copiedLink ? 'Link Copied!' : 'Share Story'}</span>
              </button>
              <span>•</span>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1 hover:text-[#7d562d] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Illustrated Parchment</span>
              </button>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button
              onClick={onNavigateCreate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#080d19] text-[#ffffff] font-label-lg text-label-lg shadow-lg shadow-[#080d19]/20 hover:scale-[1.02] hover:bg-[#1e2330] transition-all cursor-pointer"
            >
              <span className="text-[#ffdcbd]">✨</span>
              <span>Create Another Story</span>
            </button>
            <button
              onClick={onBackToStories}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                isNightMode
                  ? 'bg-[#370061] text-white hover:bg-[#370061]/80'
                  : 'bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#1c1c19]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to All Stories</span>
            </button>
          </div>
        </div>
      </section>

      {/* Curated Collection: "More Tales for Ages 6–8" */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#7d562d] font-bold">
              Curated Companions
            </span>
            <h3
              className={`font-headline-lg text-headline-lg ${
                isNightMode ? 'text-white' : 'text-[#080d19]'
              }`}
            >
              More Tales for Ages 6–8
            </h3>
            <p
              className={`font-body-md text-body-md ${
                isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
              }`}
            >
              Gentle adventures, loyal familiars, and glowing mysteries crafted for bedtime reading.
            </p>
          </div>
          <button
            onClick={onBackToStories}
            className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-[#7d562d] hover:text-[#080d19] transition-colors cursor-pointer"
          >
            <span>View full library</span>
            <span className="material-symbols-outlined text-[18px]">east</span>
          </button>
        </div>

        {/* Related Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Companion Card 1: Clockwork Owl */}
          <article
            onClick={() => onReadCompanionStory('clockwork-owl-enchanted-willow')}
            className={`group rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${
              isNightMode ? 'bg-[#1e2330] text-white' : 'bg-[#ffffff]'
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ede9]">
              <img
                alt="Barnaby and the Tick-Tock Tree"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1WE2gENKNMHAKj3zRM83u6Y61DPalNQDT9IaFnT6BBdYm9wbxeb3LAO4CPx7fFm3P2Ern-6-akN2Gi_X6ug7CBNRm4eLCSEjB1VuwOd3ICHz6CQfV_Wiorg6-X3LnxiuZBGZ_ON3EGohULTL-_OLhtudG2OosDpz4QhNaFZlau5nQKYTOEVE5NrHDgUDB7T2X45r3jfFJmXzvnYFQI_4Rzb5N2MfGG6VVr9A9T13qYqryn5AqwYvQ"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#ffffff]/90 backdrop-blur-md text-label-sm font-label-sm text-[#1c1c19] font-semibold shadow-sm">
                Bedtime • 6 min
              </span>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#7d562d] text-xs">✦</span>
                  <span className="font-label-sm text-label-sm text-[#7d562d] uppercase font-bold tracking-wider">
                    The Ironwood Forest
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm group-hover:text-[#7d562d] transition-colors">
                  Barnaby and the Tick-Tock Tree
                </h4>
                <p
                  className={`font-body-sm text-body-sm line-clamp-2 ${
                    isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
                  }`}
                >
                  When the forest clock slows down, a small brass owl must gather moonbeams to keep the seasons singing in perfect harmony.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-[#f0ede9]">
                <span
                  className={`font-label-sm text-label-sm ${
                    isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
                  }`}
                >
                  Ages 5–7 • 950 words
                </span>
                <span className="font-label-md text-label-md text-[#7d562d] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                  Read Tale <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </article>

          {/* Companion Card 2: Young Boy & Water Dragon */}
          <article
            onClick={() => onReadCompanionStory('luminous-ruins-dragons-secret')}
            className={`group rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${
              isNightMode ? 'bg-[#1e2330] text-white' : 'bg-[#ffffff]'
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ede9]">
              <img
                alt="The Boy and the Whispering Reef"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBywBGYQn48Ggb7oyUTONp-R1ptKZlnNq93Vp6c_uwAD66g7YBQIVni6GbkW9q73TX8_73cmxGT70GNMIf3EqwEuJ7gVgbEmLIvXqzvdx1-Z77W2eAjyAu1mHvrHlRAaOgQnle1NQZhwl08eFPI7k3Ya7NGcZ6XCmrB5-noGeM25s0dkhu3wAGY8IhlEUy-EmgjsPVaYvuLnGt0-XnJcLuA3dKFlGmiAxvs-OcN8I7YjtR-gwSW17Do"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#ffffff]/90 backdrop-blur-md text-label-sm font-label-sm text-[#1c1c19] font-semibold shadow-sm">
                Adventure • 8 min
              </span>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#7d562d] text-xs">✦</span>
                  <span className="font-label-sm text-label-sm text-[#7d562d] uppercase font-bold tracking-wider">
                    Coral Seas
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm group-hover:text-[#7d562d] transition-colors">
                  The Boy and the Whispering Reef
                </h4>
                <p
                  className={`font-body-sm text-body-sm line-clamp-2 ${
                    isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
                  }`}
                >
                  Leo dives beneath the turquoise tides with a gentle glow-dragon to awaken the ancient sunstones hidden beneath deep singing waters.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-[#f0ede9]">
                <span
                  className={`font-label-sm text-label-sm ${
                    isNightMode ? 'text-[#c2c6d7]' : 'text-[#45464c]'
                  }`}
                >
                  Ages 6–8 • 1,320 words
                </span>
                <span className="font-label-md text-label-md text-[#7d562d] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                  Read Tale <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </article>

          {/* Companion Card 3: Interactive Story Studio Prompt */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1e2330] via-[#080d19] to-[#370061] p-8 text-[#ffffff] shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-[#f0bd8b]/20 blur-2xl"></div>
            <div className="absolute top-4 right-4 text-[#ffdcbd] text-lg select-none">✦</div>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#ffca98]/20 flex items-center justify-center text-[#ffdcbd]">
                <span className="material-symbols-outlined text-[28px]">stylus_note</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#ffdcbd] font-bold">
                  Create Your Own Realm
                </span>
                <h4 className="font-headline-md text-headline-md text-[#ffffff]">
                  Craft a Custom Bedtime Adventure
                </h4>
                <p className="font-body-sm text-body-sm text-[#c2c6d7]">
                  Choose your child's favorite companions, magical abilities, and gentle bedtime lesson. Our weaver spins an illustrated tale in moments.
                </p>
              </div>
            </div>
            <div className="pt-6 relative z-10">
              <button
                onClick={onNavigateCreate}
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#ffdcbd] text-[#2c1600] font-label-md text-label-md hover:bg-[#f0bd8b] transition-transform group-hover:scale-[1.02] shadow-md font-bold cursor-pointer"
              >
                <span>Open Story Hearth</span>
                <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
