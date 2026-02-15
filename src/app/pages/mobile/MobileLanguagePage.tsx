import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export function MobileLanguagePage() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    const language = LANGUAGES.find(lang => lang.code === languageCode);
    toast.success(`Language changed to ${language?.name}`);
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/settings');
    }, 800);
  };

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-background" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-border/20 z-40">
        <div className="flex items-center justify-between px-4 py-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 -ml-2 active:bg-foreground/5 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-foreground" />
          </button>
          <h1 className="text-lg font-medium">Language</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search languages..."
            className="w-full px-4 py-3 bg-muted/30 border border-border/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B4770E]/20 focus:border-[#B4770E] transition-all"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-[100px] pb-8">{/* Header + safe area */}
        {/* Info Banner */}
        <div className="px-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="text-xl">ℹ️</div>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Language Settings</p>
                <p className="text-xs text-blue-800">
                  The app interface will be translated to your selected language. Currently showing English (US).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Languages List */}
        <div className="px-4 space-y-2">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">No languages found</p>
            </div>
          ) : (
            filteredLanguages.map((language) => (
              <motion.button
                key={language.code}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full p-4 rounded-2xl border transition-all ${
                  selectedLanguage === language.code
                    ? 'border-[#B4770E] bg-[#B4770E]/10'
                    : 'border-border/30 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{language.flag}</div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{language.name}</p>
                      <p className="text-xs text-foreground/60">{language.nativeName}</p>
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="w-6 h-6 rounded-full bg-[#B4770E] flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={16} className="text-white" />
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Beta Notice */}
        <div className="px-4 mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="text-xl">⚠️</div>
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">Translation Status</p>
                <p className="text-xs text-amber-800">
                  Some languages may have partial translations. We're working on completing all language packs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}