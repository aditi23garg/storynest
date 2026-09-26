import React from 'react';
import { Story } from '../types/story';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedStories: Story[];
  onSelectStory: (story: Story) => void;
  onRemoveBookmark: (storyId: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedStories,
  onSelectStory,
  onRemoveBookmark
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#080d19]/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md h-full bg-[#fcf9f4] shadow-2xl flex flex-col p-6 overflow-hidden border-l border-[#1e2330]/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ede9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7d562d] text-[22px]">bookmark</span>
            <h3 className="font-headline-sm text-headline-sm text-[#080d19]">
              Bedtime Keepsakes ({savedStories.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777c] hover:bg-[#f0ede9] hover:text-[#1c1c19] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedStories.length > 0 ? (
            savedStories.map((story) => (
              <div
                key={story.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#ffffff] shadow-sm hover:shadow-md border border-[#1e2330]/5 transition-all group"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-16 h-16 rounded-xl object-cover cursor-pointer group-hover:scale-105 transition-transform"
                  onClick={() => {
                    onSelectStory(story);
                    onClose();
                  }}
                />
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectStory(story);
                    onClose();
                  }}
                >
                  <span className="font-label-sm text-label-sm text-[#7d562d] block truncate">
                    {story.theme} · {story.ageDisplay}
                  </span>
                  <h4 className="font-headline-sm text-[1rem] text-[#080d19] group-hover:text-[#7d562d] transition-colors truncate">
                    {story.title}
                  </h4>
                  <span className="font-label-sm text-label-sm text-[#45464c]">
                    {story.readTimeMinutes} min read
                  </span>
                </div>
                <button
                  onClick={() => onRemoveBookmark(story.id)}
                  title="Remove from bedtime keepsakes"
                  className="p-2 text-[#76777c] hover:text-[#ba1a1a] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-[#45464c] flex flex-col items-center">
              <span className="material-symbols-outlined text-[40px] text-[#7d562d]/60 mb-3">
                bookmark_border
              </span>
              <p className="font-headline-sm text-headline-sm text-[#080d19] mb-1">
                No Bookmarked Tales Yet
              </p>
              <p className="font-body-sm text-body-sm max-w-xs text-center">
                Tap the heart or bookmark icon on any tale to preserve it in your quiet reading corner.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
