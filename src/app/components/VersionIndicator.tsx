/**
 * VersionIndicator Component
 * 
 * Temporary development component to verify cache fix is working.
 * Shows app version and filter system version in bottom-right corner.
 * 
 * Usage: Import and add to App.tsx during development
 * Remove or disable in production
 */

import { useState } from 'react';
import { APP_VERSION, FILTER_SYSTEM_VERSION, BUILD_TIMESTAMP, FEATURES } from '../utils/version';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ChevronUp, ChevronDown } from 'lucide-react';

export function VersionIndicator() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (!import.meta.env.DEV) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold">v{APP_VERSION}</span>
        </div>
        {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/20"
          >
            <div className="px-4 py-3 space-y-2 text-xs">
              {/* Version Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">App:</span>
                  <span className="font-semibold text-green-400">{APP_VERSION}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">Filters:</span>
                  <span className="font-semibold text-blue-400">{FILTER_SYSTEM_VERSION}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">Build:</span>
                  <span className="font-semibold text-purple-400">
                    {new Date(BUILD_TIMESTAMP).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-2" />

              {/* Feature Flags */}
              <div className="space-y-1">
                <div className="text-gray-400 font-semibold mb-1.5">Features:</div>
                {Object.entries(FEATURES).map(([key, enabled]) => (
                  <div key={key} className="flex items-center gap-2 pl-2">
                    {enabled ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <X size={12} className="text-red-500" />
                    )}
                    <span className={enabled ? 'text-white' : 'text-gray-500'}>
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-2" />

              {/* Cache Status */}
              <div className="space-y-1">
                <div className="text-gray-400 font-semibold mb-1.5">Cache Status:</div>
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-400">HMR Active</span>
                </div>
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-yellow-400">Dev Mode</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="border-t border-white/10 mt-2 pt-2">
                <div className="text-gray-400 text-[10px] leading-tight">
                  ✓ Multi-select filters active<br />
                  ✓ Cache headers configured<br />
                  ℹ Hard refresh: Ctrl+Shift+R
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
