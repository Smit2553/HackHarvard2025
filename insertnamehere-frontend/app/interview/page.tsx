'use client';

import Editor from "@/components/Editor";
import InfoPanel from "@/components/InfoPanel";
import { useVapi } from "@/components/VapiProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Interview Session Page
 * 
 * This page hosts the active interview session with:
 * - InfoPanel showing the problem statement
 * - Monaco code editor for coding
 * - End Call button to terminate the interview
 * - Call status indicator
 * 
 * The Vapi assistant is listening and can see/hear what's happening in real-time.
 */
export default function InterviewSession() {
  const router = useRouter();
  const { isCallActive, endCall } = useVapi();

  // Redirect to start page if no active call
  useEffect(() => {
    if (!isCallActive) {
      // Give time for call to establish (longer grace period)
      const timer = setTimeout(() => {
        if (!isCallActive) {
          router.push('/start');
        }
      }, 5000); // 5 seconds to allow call to connect
      
      return () => clearTimeout(timer);
    }
  }, [isCallActive, router]);

  const handleEndInterview = () => {
    endCall();
    // Wait a moment then redirect
    setTimeout(() => {
      router.push('/start');
    }, 500);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header with End Call Button */}
      <header className="flex-shrink-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Interview in Progress
          </h1>
          
          {/* Call Status Indicator */}
          {isCallActive && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Live
              </span>
            </div>
          )}
        </div>

        {/* End Call Button */}
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Speak naturally - the interviewer is listening
          </span>
          <button
            onClick={handleEndInterview}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Interview
          </button>
        </div>
      </header>

      {/* Two-Column Layout: InfoPanel + Editor */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column - Info Panel (fixed width on desktop) */}
        <aside className="w-full lg:w-96 lg:flex-shrink-0 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
          <InfoPanel title="Interview Problem" />
        </aside>

        {/* Right Column - Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            defaultLanguage="javascript"
            defaultValue={`// Welcome to your mock interview!
// The AI interviewer can hear you through your microphone.
// Start coding your solution here.

function solution() {
  // Your code here
  
}

// Test your solution
console.log(solution());
`}
          />
        </div>
      </div>
    </div>
  );
}
