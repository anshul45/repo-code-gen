'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [productIdea, setProductIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!productIdea.trim()) return;
    
   router.push("/project/123")
  };

  return (
    <div className="flex flex-col h-[91vh] items-center justify-items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 row-start-2 items-center w-full max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 inline-block text-transparent bg-clip-text">
            Build Your Dream Product
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            Tell us about your product idea, and let&apos;s make it happen
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 text-center">
            What product do you want to build?
          </h2>
          <input
            type="text"
            value={productIdea}
            onChange={(e) => setProductIdea(e.target.value)}
            placeholder="Enter your product idea..."
            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-6 hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating Project...' : 'Let\'s Build Together →'}
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-gray-600">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}