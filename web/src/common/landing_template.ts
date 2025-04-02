export const files = {
  "package.json": {
    file: {
      contents: `{
  "name": "landing-page",
  "version": "1.0.0",
  "description": "Landing page project",
  "scripts": {
    "dev": "npx tailwindcss -i ./css/tailwind.css -o ./css/tailwind-build.css --watch",
    "build": "npx tailwindcss -i ./css/tailwind.css -o ./css/tailwind-build.css --minify",
    "serve": "npx http-server . -p 3000 --cors '*'"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "http-server": "^14.1.1"
  }
}`
    }
  },
  "index.html": {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link href="css/tailwind-build.css" rel="stylesheet">
    <link href="css/index.css" rel="stylesheet">
</head>
<body class="bg-white dark:bg-gray-900">
    <div id="app"></div>
    <script src="index.js"></script>
</body>
</html>`
    }
  },
  "index.js": {
    file: {
      contents: `document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  app.innerHTML = \`
    <div class="min-h-screen">
      <!-- Navigation -->
      <nav class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">Logo</span>
              </div>
            </div>
            <div class="flex items-center">
              <div class="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#" class="text-gray-900 dark:text-white hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#" class="text-gray-900 dark:text-white hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#" class="text-gray-900 dark:text-white hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="relative bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span class="block">Welcome to Your</span>
              <span class="block text-indigo-600">Landing Page</span>
            </h1>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create beautiful landing pages with ease using modern web technologies.
            </p>
            <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div class="rounded-md shadow">
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div class="mt-8 md:mt-0">
            <p class="text-center text-base text-gray-400">&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  \`;
});`
    }
  },
  "tailwind.config.js": {
    file: {
      contents: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./index.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}`
    }
  },
  "css": {
    directory: {
      "index.css": {
        file: {
          contents: `/* Custom styles */
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
}

/* Add your custom styles here */
`
        }
      },
      "tailwind.css": {
        file: {
          contents: `@tailwind base;
@tailwind components;
@tailwind utilities;`
        }
      },
      "tailwind-build.css": {
        file: {
          contents: `/* This file will be auto-generated when building with Tailwind CLI */`
        }
      }
    }
  },
  "assets": {
    directory: {}
  }
};
