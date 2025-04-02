'use client';

import { Panel, PanelGroup } from 'react-resizable-panels';

interface PreviewPanelProps {
  url: string | null;
  isLoading: boolean;
  onUrlChange: (url: string) => void;
  onReset: () => void;
}

export function PreviewPanel({ url, isLoading, onUrlChange, onReset }: PreviewPanelProps) {
  return (
    <PanelGroup direction="vertical" className="h-full w-full min-w-0 [&>div]:p-0 overflow-hidden">
      <Panel defaultSize={100} className="h-full w-full min-w-0 p-0 overflow-hidden">
        <div className="h-full w-full flex flex-col min-w-0 overflow-hidden">
          {/* Preview URL Bar */}
          <div className="p-0 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg min-w-0 mx-3 my-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <input
                  type="text"
                  value={url || ''}
                  onChange={(e) => onUrlChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newUrl = e.currentTarget.value;
                      if (newUrl.startsWith('http://localhost:')) {
                        onUrlChange(newUrl);
                      }
                    }
                  }}
                  placeholder="Enter URL (e.g. http://localhost:3000)"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <button
                onClick={onReset}
                className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mx-3 my-2"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex-1 relative min-w-0 overflow-hidden">
            {isLoading && !url ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white dark:bg-gray-800">
                Loading preview...
              </div>
            ) : (
              <iframe
                src={url as string}
                title="WebContainer"
                className="absolute inset-0 w-full h-full border-none"
              />
            )}
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}
