import React, { useState } from 'react';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f6f3ee] mt-12 border-t border-[#1e2330]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                alt="StoryNest Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmlO2wgsA1Nw4nSrLGQfQ992_MEqrz3NyxDKAajF6VWM8fhkzwbkRkHWwARSkvOR_8o6M9Wl7H6AAf_1eMfjXy3eVCV4vqUjBAe7IR5_czkOG0T5pyRbQaB9o1jcIaPfQI_MZN3J42NoNgns1-3W7UYKXqY9f7k89w5U1ewcnW4bPA_VW6X_S6wc2hGdHfkFNj8nvQW7eUgEH3ZeVke6263B829v-NTf9q7eCBqn5KgOHMMXrwFOhK"
              />
              <span className="font-headline-sm text-headline-sm text-[#080d19]">
                StoryNest
              </span>
            </div>
            <p className="font-headline-sm text-headline-sm italic text-[#7d562d] leading-snug">
              “Every character has a story waiting to be told.”
            </p>
            <p className="font-body-sm text-body-sm text-[#45464c]">
              A warm sanctuary crafted for storytellers, young dreamers, and enchanted worlds woven under starlight.
            </p>
          </div>

          {/* Curated Realms */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-label-lg text-label-lg uppercase tracking-wider text-[#080d19]">
              Curated Realms
            </span>
            <div className="flex flex-col gap-2 font-body-sm text-body-sm">
              {['Adventure', 'Fantasy', 'Bedtime', 'Mystery', 'Sci-Fi'].map((realm) => (
                <button
                  key={realm}
                  onClick={() => onSelectCategory?.(realm.toLowerCase())}
                  className="text-left text-[#45464c] hover:text-[#7d562d] transition-colors cursor-pointer"
                >
                  {realm}
                </button>
              ))}
            </div>
          </div>

          {/* Magical Bedtime Chronicle */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <span className="font-label-lg text-label-lg uppercase tracking-wider text-[#080d19]">
              Magical Bedtime Chronicle
            </span>
            <p className="font-body-sm text-body-sm text-[#45464c]">
              Receive an enchanting, original weekly tale straight to your hearth and reading corner.
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-[#ffca98]/30 border border-[#7d562d]/20 text-[#7a532a] font-label-md text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>The night owls will deliver this week's tale to your inbox. Sweet dreams!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-1">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#e5e2dd] text-[#1c1c19] placeholder:text-[#76777c] font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-[#f0bd8b]"
                  placeholder="Enter your secret email..."
                  type="email"
                  required
                />
                <button
                  className="px-6 py-2.5 rounded-full bg-[#080d19] text-[#ffffff] font-label-lg text-label-lg hover:bg-[#1e2330] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-[#1e2330]/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-[#45464c]">
          <p>© 2024 StoryNest. All stories, creatures, and wonder reserved.</p>
          <div className="flex items-center gap-6 font-label-md text-label-md">
            <span className="hover:text-[#1c1c19] transition-colors cursor-pointer">
              Privacy Sanctum
            </span>
            <span className="hover:text-[#1c1c19] transition-colors cursor-pointer">
              Tales License
            </span>
            <span className="hover:text-[#1c1c19] transition-colors cursor-pointer">
              Keeper Guidelines
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
