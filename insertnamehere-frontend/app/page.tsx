import Link from "next/link";

/**
 * Home page - Landing page for the interview practice app
 */
export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Interview Practice Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Prepare for your technical interviews with real coding challenges and
          a professional mock interview environment.
        </p>
        <Link
          href="/interview"
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors"
        >
          Start Mock Interview
        </Link>
      </div>
    </div>
  );
}
