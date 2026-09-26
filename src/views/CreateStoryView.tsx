import React, { useState, useEffect } from 'react';
import { Story } from '../types/story';

interface CreateStoryViewProps {
  onStoryCreated: (story: Story) => void;
  onReadStory: (story: Story) => void;
  initialPrompt?: string;
}

export const CreateStoryView: React.FC<CreateStoryViewProps> = ({
  onStoryCreated,
  onReadStory,
  initialPrompt = ''
}) => {
  // Form State
  const [heroName, setHeroName] = useState(initialPrompt || '');
  const [ageGroup, setAgeGroup] = useState('Budding Reader (6–8 yrs)');
  const [theme, setTheme] = useState('Adventure');
  const [companion, setCompanion] = useState('');
  const [moral, setMoral] = useState('Bravery & Inner Courage');
  const [setting, setSetting] = useState('The Whispering Redwood Canopy');
  const [showEnhancers, setShowEnhancers] = useState(false);
  const [nameError, setNameError] = useState(false);

  // Flow State
  const [viewState, setViewState] = useState<'form' | 'loading' | 'result'>('form');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(
    'Gathering stardust and aligning the night constellations...'
  );
  const [statusLabel, setStatusLabel] = useState('Conjuring characters... 15%');
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setHeroName(initialPrompt);
    }
  }, [initialPrompt]);

  // Audio speech synthesis
  useEffect(() => {
    if (!isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (generatedStory && 'speechSynthesis' in window) {
      const fullText = `${generatedStory.title}. ${generatedStory.chapters
        .map((c) => c.content.join(' '))
        .join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 0.9; // gentle bedtime pace
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingAudio, generatedStory]);

  const handlePrefill = () => {
    setHeroName('Barnaby the Brave Hedgehog');
    setAgeGroup('Budding Reader (6–8 yrs)');
    setTheme('Adventure');
    setCompanion('Pip the Luminous Moth');
    setMoral('Bravery & Inner Courage');
    setSetting('The Whispering Redwood Canopy');
    setShowEnhancers(true);
    setNameError(false);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setViewState('loading');
    setLoadingProgress(0);
    window.scrollTo({ top: 120, behavior: 'smooth' });

    // Progress animation
    const phrases = [
      'Gathering stardust and aligning the night constellations...',
      'Tuning the enchanted owl’s quill and spinning the plot loom...',
      'Infusing deep wonder, bedtime warmth, and bravery...',
      'Illuminating the manuscript folio...'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setLoadingProgress(35);
        setStatusLabel('Conjuring characters... 35%');
        setLoadingText(phrases[1]);
      } else if (step === 2) {
        setLoadingProgress(70);
        setStatusLabel('Weaving realm lore... 70%');
        setLoadingText(phrases[2]);
      } else if (step === 3) {
        setLoadingProgress(95);
        setStatusLabel('Polishing illuminated text... 95%');
        setLoadingText(phrases[3]);
      }
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);

      const cleanedHero = heroName.trim();
      const cleanedSetting = setting.replace(/^The\s+/, '');
      const companionText = companion.trim() || 'a loyal woodland companion';

      const newStory: Story = {
        id: `custom-story-${Date.now()}`,
        title: `The Legend of ${cleanedHero} and the Secret of ${cleanedSetting}`,
        subtitle: `A ${theme.toLowerCase()} bedtime quest through the whispering canopies and golden hollows.`,
        hero: cleanedHero,
        companion: companionText,
        category: theme.toLowerCase(),
        theme: theme,
        ageGroup: ageGroup.includes('3–5')
          ? '3–5'
          : ageGroup.includes('6–8')
          ? '6–8'
          : ageGroup.includes('9–12')
          ? '9–12'
          : ageGroup.includes('13–17')
          ? '13–17'
          : '18+',
        ageDisplay: ageGroup.split(' ')[0] + ' ' + (ageGroup.match(/\((.*?)\)/)?.[1] || ''),
        readTimeMinutes: 4,
        wordCount: 880,
        badge: 'Custom Folio',
        coverImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCnzh9Cl9sH_sw_qVxto8fkLzz01RDW9W2TtstjZvAHeSdC8tEaGYk-8i5jcn_zjIQyA7obJW4453ktMwwMCDabZ-9QKaZwbdwjXqE7cIQxxkPjDj45Z92-Dy2hj7ZrRlOELZb5odUEWaHc3PJHd6uvAJo4RBzQ0oolcqFSE9edx02e7-wxpj5SalTJl1pnMJymYWxGbD3D_SkQtHa6fOYAhErXijJ6arRSK3h0v0zNE-YSoXw8qmAz',
        readingImage:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCnzh9Cl9sH_sw_qVxto8fkLzz01RDW9W2TtstjZvAHeSdC8tEaGYk-8i5jcn_zjIQyA7obJW4453ktMwwMCDabZ-9QKaZwbdwjXqE7cIQxxkPjDj45Z92-Dy2hj7ZrRlOELZb5odUEWaHc3PJHd6uvAJo4RBzQ0oolcqFSE9edx02e7-wxpj5SalTJl1pnMJymYWxGbD3D_SkQtHa6fOYAhErXijJ6arRSK3h0v0zNE-YSoXw8qmAz',
        synopsis: `Accompanied by ${companionText}, ${cleanedHero} journeys into ${setting} discovering how ${moral.toLowerCase()} lights the path home.`,
        audioVoicedBy: 'Bramble the Warm Storyteller',
        audioDuration: '03:42',
        likesCount: 1,
        pageCount: 6,
        isCustom: true,
        chapters: [
          {
            number: 'Chapter I',
            title: `The Threshold of ${setting}`,
            content: [
              `High atop the mystical trails of ${setting}, ${cleanedHero} drew a deep breath of the pine-scented evening air. The moon cast silver ripples across ancient stone paths, reminding every living creature that quiet hours carry the deepest magic. Beside ${cleanedHero}, ${companionText} flickered with gentle warmth, pointing toward the winding valley where the great mystery of ${moral.toLowerCase()} was waiting to be unlocked.`,
              `Every step along the winding expanse revealed why tales of this place had endured for generations. Shadows danced like playful sprites, not out of malice, but eager to share the secret riddles carved into ancient tree trunks. "Listen closely," whispered ${cleanedHero}, crouching low to inspect the starlit tracks. "True discovery is never rushed. It belongs to those who observe with kindness and walk without fear."`
            ],
            artifact: {
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDKtWcllcZbzpFJVIfQP4cJzWr3XsrfXv7gAoDn94VpBQl1jpypcduNR6f77-A237s5dXkyVMVrpsBBgP2eSDrh0p6OuKUaPa1NobhwLNpBJNzOiCndIq15oUMDsOu4icEYOQyU_txgavij10_wwq0xdch0X5xpotqbO3tIfXzWcaed8kTW5j6n_QRkzBbDWmdSFyKTtugcDpzs-ub_djrki25agrrRHIGqGJBzWSbGw-ITNoOXL6VY',
              caption: 'Artifact of the Journey',
              title: 'The Starlight Compass',
              description:
                'A gentle compass tuned not to north, but to kindness and peaceful sleep.'
            }
          },
          {
            number: 'Chapter II',
            title: 'The Heart of the Golden Glade',
            content: [
              `When the final threshold was reached, the answer was neither hidden in a golden chest nor locked behind crystal gates. It lay in the quiet realization of ${moral.toLowerCase()}, shining as naturally as fireflies over an evening glade. With their heart filled with peace and their spirit brimming with quiet pride, ${cleanedHero} and ${companionText} turned back toward the warm lamps of home, knowing this night had carved a golden memory into the stars forever.`
            ],
            quote: {
              text: 'Bravery isn’t the lack of fearful shadows; it is taking the lantern and lighting them until they dance.',
              author: `From the Journal of ${cleanedHero}`
            }
          }
        ]
      };

      setGeneratedStory(newStory);
      onStoryCreated(newStory);
      setViewState('result');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 2500);
  };

  const handleSaveToLibrary = () => {
    if (generatedStory) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Decorative Celestial Atmosphere Elements */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#ffdcbd]/30 via-[#f1dbff]/15 to-transparent blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute top-48 -left-20 w-80 h-80 bg-[#ffca98]/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-96 -right-24 w-96 h-96 bg-[#deb7ff]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 relative z-10">
          {/* Header Section */}
          <section className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ebe8e3] text-[#7d562d] mb-4 shadow-sm">
              <span className="text-xs">✦</span>
              <span className="font-label-md text-label-md tracking-widest uppercase">
                The Story Sanctum Forge
              </span>
              <span className="text-xs">✦</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-[#080d19] tracking-tight mb-4">
              Weave a New Story
            </h1>
            <p className="font-body-lg text-body-lg text-[#45464c] max-w-2xl mx-auto">
              Shape a one-of-a-kind adventure for bedtime, classrooms, or afternoon daydreaming. Fill out the magic ingredients below and let the starlight quill do the rest.
            </p>

            {/* Quick Demo Pre-fill Trigger */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handlePrefill}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#080d19] font-label-md text-label-md transition-all shadow-sm group cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-[#7d562d] group-hover:rotate-12 transition-transform">
                  magic_button
                </span>
                <span>Fill with Magical Example</span>
              </button>
              <span className="font-label-sm text-label-sm text-[#45464c]/70">
                or customize every star below
              </span>
            </div>
          </section>

          {/* 1. Main Creation Form */}
          {viewState === 'form' && (
            <div className="bg-[#ffffff]/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl transition-all duration-500 border border-[#1e2330]/5">
              <form className="space-y-10" onSubmit={handleGenerate}>
                {/* 1. Protagonist / Hero Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label
                      className="flex items-center gap-2 font-headline-sm text-headline-sm text-[#080d19]"
                      htmlFor="hero-name"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#ffca98]/40 flex items-center justify-center text-[#7d562d]">
                        <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                      </span>
                      <span>Hero's Name &amp; Title</span>
                      <span className="text-[#ba1a1a] font-body-sm text-body-sm">*</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-[#45464c] uppercase tracking-wider">
                      Step 01 / 04
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#45464c]">
                    Give your protagonist a spirited name, endearing title, or whimsical honorific they'll adore.
                  </p>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7d562d]">
                      <span className="material-symbols-outlined text-[22px]">draw</span>
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#f6f3ee] text-[#1c1c19] placeholder:text-[#76777c] font-body-md text-body-md focus:bg-[#ffffff] focus:outline-none transition-all shadow-inner"
                      id="hero-name"
                      value={heroName}
                      onChange={(e) => {
                        setHeroName(e.target.value);
                        if (nameError) setNameError(false);
                      }}
                      placeholder="e.g., Barnaby the Brave Hedgehog, Princess Maya, Jasper the Star-Hopper"
                      type="text"
                    />
                  </div>

                  {nameError && (
                    <div className="flex items-center gap-2 text-[#ba1a1a] font-label-md text-label-md pl-1">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>Please grant your hero a name before conjuring their tale!</span>
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-label-sm text-label-sm text-[#45464c] mr-1">
                      Whispered Ideas:
                    </span>
                    {[
                      'Pip the Squirrel',
                      'Luna the Time-Keeper',
                      'Sammy & the Starlight Dragon',
                      'Detective Oliver the Owl'
                    ].map((idea) => (
                      <button
                        key={idea}
                        onClick={() => {
                          setHeroName(idea);
                          setNameError(false);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[#f0ede9] hover:bg-[#ffdcbd] text-[#1c1c19] font-label-md text-label-md transition-colors cursor-pointer"
                        type="button"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-[#ebe8e3]"></div>

                {/* 2. Age Group Selector */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="flex items-center gap-2 font-headline-sm text-headline-sm text-[#080d19]">
                        <span className="w-8 h-8 rounded-full bg-[#ffca98]/40 flex items-center justify-center text-[#7d562d]">
                          <span className="material-symbols-outlined text-[18px]">child_care</span>
                        </span>
                        <span>Age Group</span>
                      </h2>
                      <p className="font-body-sm text-body-sm text-[#45464c] mt-1">
                        Calibrated for vocabulary, sentence cadence, pacing, and emotional depth.
                      </p>
                    </div>
                    <span className="font-label-sm text-label-sm text-[#45464c] uppercase tracking-wider">
                      Step 02 / 04
                    </span>
                  </div>

                  {/* Radio Card Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                    {[
                      {
                        title: 'Early Wonder',
                        badge: '3–5 yrs',
                        desc: 'Gentle, lyrical rhyme, tactile imagery & soothing comfort.'
                      },
                      {
                        title: 'Budding Reader',
                        badge: '6–8 yrs',
                        desc: 'Playful curiosity, humorous encounters & spirited light quests.'
                      },
                      {
                        title: 'Middle Explorer',
                        badge: '9–12 yrs',
                        desc: 'Thrilling mysteries, clever plot twists & rich immersive lore.'
                      },
                      {
                        title: 'Young Hero',
                        badge: '13–17 yrs',
                        desc: 'Resilience, moral choices, complex companionship & grit.'
                      },
                      {
                        title: 'Timeless & Poetic',
                        badge: '18+ Readers',
                        desc: 'Philosophical metaphors, layered prose, meditative warmth & deep literary atmosphere.',
                        wide: true
                      }
                    ].map((card) => {
                      const fullVal = `${card.title} (${card.badge})`;
                      const isSelected = ageGroup === fullVal;
                      return (
                        <div
                          key={card.title}
                          onClick={() => setAgeGroup(fullVal)}
                          className={`relative cursor-pointer flex flex-col p-4 rounded-2xl transition-all shadow-sm ${
                            card.wide ? 'sm:col-span-2 lg:col-span-2' : ''
                          } ${
                            isSelected
                              ? 'bg-[#f0ede9] ring-2 ring-[#7d562d] shadow-md'
                              : 'bg-[#f6f3ee] hover:bg-[#f0ede9]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] font-label-sm text-label-sm">
                              {card.badge}
                            </span>
                            <span
                              className={`material-symbols-outlined text-[#7d562d] transition-opacity ${
                                isSelected ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              check_circle
                            </span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-[#080d19] mt-2">
                            {card.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-[#45464c] mt-1">
                            {card.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-px bg-[#ebe8e3]"></div>

                {/* 3. Category / Realm Selector */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="flex items-center gap-2 font-headline-sm text-headline-sm text-[#080d19]">
                        <span className="w-8 h-8 rounded-full bg-[#ffca98]/40 flex items-center justify-center text-[#7d562d]">
                          <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                        </span>
                        <span>Story Theme &amp; Realm</span>
                      </h2>
                      <p className="font-body-sm text-body-sm text-[#45464c] mt-1">
                        Choose the dominant enchantment or world setting for the journey.
                      </p>
                    </div>
                    <span className="font-label-sm text-label-sm text-[#45464c] uppercase tracking-wider">
                      Step 03 / 04
                    </span>
                  </div>

                  {/* Realm Pills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                    {[
                      { name: 'Adventure', icon: '🧭' },
                      { name: 'Fantasy', icon: '🔮' },
                      { name: 'Mystery', icon: '🔍' },
                      { name: 'Friendship', icon: '🤝' },
                      { name: 'Fairy Tale', icon: '👑' },
                      { name: 'Animals', icon: '🐾' },
                      { name: 'Bedtime', icon: '🌙' },
                      { name: 'Sci-Fi', icon: '🚀' },
                      { name: 'Wisdom', icon: '🦉' },
                      { name: 'Mythology', icon: '✨' }
                    ].map((item) => {
                      const isSelected = theme === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setTheme(item.name)}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all text-center group shadow-sm cursor-pointer ${
                            isSelected
                              ? 'bg-[#ffdcbd] text-[#2c1600] ring-2 ring-[#7d562d]'
                              : 'bg-[#f6f3ee] hover:bg-[#f0ede9] text-[#080d19]'
                          }`}
                        >
                          <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                            {item.icon}
                          </span>
                          <span className="font-label-md text-label-md font-bold">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-px bg-[#ebe8e3]"></div>

                {/* 4. Optional Story Enhancers */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
                      onClick={() => setShowEnhancers(!showEnhancers)}
                      type="button"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#ffca98]/40 flex items-center justify-center text-[#7d562d] group-hover:bg-[#7d562d] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                      </span>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-[#080d19] group-hover:text-[#7d562d] transition-colors flex items-center gap-2">
                          <span>Optional Story Enhancers</span>
                          <span
                            className={`material-symbols-outlined text-[#45464c] text-[20px] transition-transform duration-300 ${
                              showEnhancers ? 'rotate-180' : ''
                            }`}
                          >
                            expand_more
                          </span>
                        </h3>
                        <p className="font-body-sm text-body-sm text-[#45464c]">
                          Companion sidekick, heart-guiding moral, and unique landscape setting.
                        </p>
                      </div>
                    </button>
                    <span className="font-label-sm text-label-sm text-[#45464c] uppercase tracking-wider">
                      Step 04 / 04
                    </span>
                  </div>

                  {showEnhancers && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 animate-fadeIn">
                      {/* Companion */}
                      <div className="space-y-1.5">
                        <label
                          className="font-label-md text-label-md text-[#080d19]"
                          htmlFor="companion-name"
                        >
                          Companion / Sidekick
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7d562d]">
                            <span className="material-symbols-outlined text-[18px]">
                              cruelty_free
                            </span>
                          </span>
                          <input
                            className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#f6f3ee] text-[#1c1c19] placeholder:text-[#76777c] font-body-sm text-body-sm focus:outline-none focus:bg-[#ffffff] transition-all"
                            id="companion-name"
                            value={companion}
                            onChange={(e) => setCompanion(e.target.value)}
                            placeholder="e.g., Barnaby the Badger, Starlight Sprite"
                            type="text"
                          />
                        </div>
                      </div>

                      {/* Moral / Lesson */}
                      <div className="space-y-1.5">
                        <label
                          className="font-label-md text-label-md text-[#080d19]"
                          htmlFor="story-moral"
                        >
                          Heart's Moral or Theme
                        </label>
                        <div className="relative">
                          <select
                            className="w-full pl-3 pr-8 py-3 rounded-xl bg-[#f6f3ee] text-[#1c1c19] font-body-sm text-body-sm focus:outline-none focus:bg-[#ffffff] appearance-none transition-all cursor-pointer"
                            id="story-moral"
                            value={moral}
                            onChange={(e) => setMoral(e.target.value)}
                          >
                            <option value="Bravery & Inner Courage">Bravery & Inner Courage</option>
                            <option value="Kindness & Generosity">Kindness & Generosity</option>
                            <option value="Overcoming Fear of the Dark">
                              Overcoming Fear of the Dark
                            </option>
                            <option value="The Value of Patience">The Value of Patience</option>
                            <option value="Honesty & Trust">Honesty & Trust</option>
                            <option value="Curiosity & Discovery">Curiosity & Discovery</option>
                          </select>
                          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#45464c]">
                            <span className="material-symbols-outlined text-[18px]">
                              expand_more
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Setting / Realm */}
                      <div className="space-y-1.5">
                        <label
                          className="font-label-md text-label-md text-[#080d19]"
                          htmlFor="story-setting"
                        >
                          Setting / Landscape
                        </label>
                        <div className="relative">
                          <select
                            className="w-full pl-3 pr-8 py-3 rounded-xl bg-[#f6f3ee] text-[#1c1c19] font-body-sm text-body-sm focus:outline-none focus:bg-[#ffffff] appearance-none transition-all cursor-pointer"
                            id="story-setting"
                            value={setting}
                            onChange={(e) => setSetting(e.target.value)}
                          >
                            <option value="The Whispering Redwood Canopy">
                              The Whispering Redwood Canopy
                            </option>
                            <option value="The Luminous Sunken City">The Luminous Sunken City</option>
                            <option value="The Clockwork Cloud Isles">
                              The Clockwork Cloud Isles
                            </option>
                            <option value="The Hearth & Cozy Lantern Nook">
                              The Hearth & Cozy Lantern Nook
                            </option>
                            <option value="The Stardust Dunes of Orion">
                              The Stardust Dunes of Orion
                            </option>
                          </select>
                          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#45464c]">
                            <span className="material-symbols-outlined text-[18px]">
                              expand_more
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <div className="pt-6">
                  <button
                    className="relative group w-full py-5 rounded-2xl bg-[#080d19] text-[#ffffff] font-headline-sm text-headline-sm flex items-center justify-center gap-3 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform cursor-pointer"
                    type="submit"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffca98]/20 via-[#ffdcbd]/40 to-[#ffca98]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="text-[#ffdcbd] animate-pulse text-xl">✦</span>
                    <span className="relative z-10 font-bold tracking-wide">Generate Story</span>
                    <span className="text-[#ffdcbd] animate-pulse text-xl">✦</span>
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-3 text-[#45464c] font-label-sm text-label-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#7d562d]">
                        verified
                      </span>{' '}
                      Hand-crafted Narrative AI
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#7d562d]">
                        lock
                      </span>{' '}
                      Private Sanctum
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#7d562d]">
                        speed
                      </span>{' '}
                      Instant 3-Second Weaver
                    </span>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* 2. Loading State Panel */}
          {viewState === 'loading' && (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#ffffff]/80 backdrop-blur-xl rounded-3xl shadow-xl transition-all border border-[#1e2330]/5">
              {/* Magic Celestial Orb Animation */}
              <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#ffdcbd]/30 animate-ping opacity-75"></div>
                <div className="absolute inset-2 rounded-full border-2 border-[#f0bd8b] border-dashed animate-spin"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7d562d] to-[#ffca98] flex items-center justify-center shadow-lg shadow-[#7d562d]/30">
                  <span className="material-symbols-outlined text-[#fcf9f4] text-[36px] animate-pulse">
                    auto_stories
                  </span>
                </div>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-[#080d19] mb-3">
                Weaving Your Story...
              </h2>
              <p className="font-body-md text-body-md text-[#7d562d] italic max-w-md mx-auto mb-8 min-h-[3.25rem]">
                {loadingText}
              </p>
              {/* Progress bar */}
              <div className="w-full max-w-md bg-[#ebe8e3] h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#7d562d] to-[#f0bd8b] rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className="font-label-sm text-label-sm text-[#45464c] mt-3 tracking-widest uppercase">
                {statusLabel}
              </span>
            </div>
          )}

          {/* 3. Generated Story Result View */}
          {viewState === 'result' && generatedStory && (
            <div className="flex flex-col space-y-8 animate-fadeIn">
              <article className="bg-[#ffffff] rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden border border-[#1e2330]/5">
                {/* Decorative Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ffca98] via-[#7d562d] to-[#1e2330]"></div>

                {/* Story Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 bg-[#f6f3ee]/50 -mx-6 -mt-6 sm:-mx-12 sm:-mt-12 p-6 sm:p-8 rounded-t-3xl border-b border-[#e5e2dd]/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#ebe8e3] text-[#080d19] font-label-md text-label-md font-semibold">
                      {generatedStory.ageDisplay}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] font-label-md text-label-md font-semibold">
                      {generatedStory.theme}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-[#f1dbff] text-[#2d0050] font-label-md text-label-md font-semibold flex items-center gap-1">
                      <span>✦</span>
                      <span>Hero {generatedStory.hero}</span>
                    </span>
                  </div>
                  {/* Reading Duration & Date */}
                  <div className="flex items-center gap-3 font-label-sm text-label-sm text-[#45464c]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 4 min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">volume_up</span> Audio Ready
                    </span>
                  </div>
                </div>

                {/* Story Title & Opening */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="font-label-sm text-label-sm text-[#7d562d] tracking-widest uppercase mb-2 block">
                    StoryNest Original Folio
                  </span>
                  <h1 className="font-headline-xl text-headline-xl text-[#080d19] leading-tight mb-4">
                    {generatedStory.title}
                  </h1>
                  <p className="font-headline-sm text-headline-sm italic text-[#7d562d]">
                    {generatedStory.subtitle}
                  </p>
                </div>

                {/* Audio Narrator Bar */}
                <div className="mb-10 p-4 rounded-2xl bg-[#f6f3ee] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#1e2330]/5">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-12 h-12 rounded-full bg-[#080d19] text-[#ffffff] flex items-center justify-center hover:scale-105 transition-transform shadow-md cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isPlayingAudio ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div>
                      <span className="font-label-md text-label-md text-[#080d19] block">
                        {isPlayingAudio ? 'Speaking aloud...' : 'Listen to Enchanted Narration'}
                      </span>
                      <span className="font-body-sm text-body-sm text-[#45464c] block">
                        Narrator: {generatedStory.audioVoicedBy} (Soft &amp; Calming)
                      </span>
                    </div>
                  </div>

                  {/* Soundwave animation */}
                  <div className="flex items-center gap-1 h-8 w-full sm:w-48 justify-center">
                    {[3, 6, 4, 7, 5, 2, 8, 4, 6, 3].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 bg-[#7d562d] rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'animate-pulse' : ''
                        }`}
                        style={{ height: `${h * 3.5}px` }}
                      ></span>
                    ))}
                  </div>
                  <span className="font-label-sm text-label-sm text-[#45464c] font-mono">03:42</span>
                </div>

                {/* Story Chapters Text with Drop Cap */}
                <div className="prose max-w-3xl mx-auto space-y-6 text-[#1c1c19] leading-relaxed font-body-lg text-body-lg">
                  {generatedStory.chapters.map((chap, cIdx) => (
                    <div key={cIdx} className="space-y-4">
                      {chap.content.map((para, pIdx) => {
                        if (cIdx === 0 && pIdx === 0) {
                          const firstLetter = para[0];
                          const rest = para.slice(1);
                          return (
                            <p key={pIdx}>
                              <span className="float-left text-6xl font-headline-xl text-[#7d562d] pr-3 font-serif leading-none select-none">
                                {firstLetter}
                              </span>
                              {rest}
                            </p>
                          );
                        }
                        return <p key={pIdx}>{para}</p>;
                      })}

                      {/* Chapter 1 Vignette Art */}
                      {cIdx === 0 && (
                        <div className="my-8 rounded-2xl overflow-hidden bg-[#ebe8e3] shadow-md">
                          <div
                            className="relative w-full h-64 bg-cover bg-center"
                            style={{
                              backgroundImage: `url('${generatedStory.coverImage}')`
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080d19]/80 via-transparent to-transparent flex items-end p-6">
                              <span className="text-[#fcf9f4] font-headline-sm text-headline-sm italic">
                                "Listen to the rustle of the leaves, {generatedStory.hero}. The stars never forget a promise."
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chapter Quote */}
                      {chap.quote && (
                        <div className="my-6 p-6 rounded-2xl bg-[#f6f3ee] shadow-sm border-l-4 border-[#ffdcbd]">
                          <p className="font-headline-md text-headline-md italic text-[#080d19] leading-snug">
                            “{chap.quote.text}”
                          </p>
                          <span className="block mt-2 font-label-md text-label-md text-[#7d562d] font-semibold">
                            — {chap.quote.author}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Action Suite */}
                <div className="mt-12 pt-8 bg-[#f6f3ee]/40 -mx-6 -mb-6 sm:-mx-12 sm:-mb-12 p-6 sm:p-8 rounded-b-3xl flex flex-wrap items-center justify-between gap-4 border-t border-[#ebe8e3]">
                  <button
                    onClick={() => {
                      setViewState('form');
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#080d19] text-[#ffffff] font-label-lg text-label-lg hover:bg-[#1e2330] transition-transform hover:scale-[1.02] shadow-md cursor-pointer"
                    type="button"
                  >
                    <span className="text-[#ffdcbd] text-sm">✦</span>
                    <span>Weave Another Story</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onReadStory(generatedStory)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#080d19] font-label-md text-label-md transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                      <span>Read in Sanctuary Mode</span>
                    </button>
                    <button
                      onClick={handleSaveToLibrary}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#080d19] font-label-md text-label-md transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {savedSuccess ? 'bookmark' : 'bookmark_add'}
                      </span>
                      <span>{savedSuccess ? 'Saved to Sanctuary!' : 'Save to Library'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#080d19] font-label-md text-label-md transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                      <span>Print Storybook</span>
                    </button>
                  </div>
                </div>
              </article>

              {/* Story Crafting Insight Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#f6f3ee] flex items-start gap-3 shadow-sm border border-[#1e2330]/5">
                  <div className="w-10 h-10 rounded-full bg-[#ffdcbd]/40 flex items-center justify-center text-[#7d562d] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-[#080d19] block">
                      Tuned Pacing
                    </span>
                    <p className="font-body-sm text-body-sm text-[#45464c]">
                      Calibrated sentence lengths prevent bedtime overstimulation while fostering reading confidence.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#f6f3ee] flex items-start gap-3 shadow-sm border border-[#1e2330]/5">
                  <div className="w-10 h-10 rounded-full bg-[#ffdcbd]/40 flex items-center justify-center text-[#7d562d] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">palette</span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-[#080d19] block">
                      Lush Sensory Lore
                    </span>
                    <p className="font-body-sm text-body-sm text-[#45464c]">
                      Embedded rich descriptions of scents, textures, and sounds to awaken nighttime imaginations.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#f6f3ee] flex items-start gap-3 shadow-sm border border-[#1e2330]/5">
                  <div className="w-10 h-10 rounded-full bg-[#ffdcbd]/40 flex items-center justify-center text-[#7d562d] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-[#080d19] block">
                      Original &amp; Safe
                    </span>
                    <p className="font-body-sm text-body-sm text-[#45464c]">
                      Wholesome guidance algorithm ensures violence-free adventures suited for gentle dreams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
