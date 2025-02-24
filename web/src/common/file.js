const files = {
    src: {
      directory: {
        app: {
          directory: {
            'layout.tsx': {
              file: {
                contents: `
                  import '@/styles/globals.css'
                  import { Inter } from 'next/font/google'
                  
                  const inter = Inter({ subsets: ['latin'] })
                  
                  export default function RootLayout({
                    children,
                  }: {
                    children: React.ReactNode
                  }) {
                    return (
                      <html lang="en">
                        <body className={inter.className}>{children}</body>
                      </html>
                    )
                  }
                `
              }
            },
            'page.tsx': {
              file: {
                contents: `
                  import { Button } from '@/components/ui/button'
                  
                  export default function Home() {
                    return (
                      <main className="flex min-h-screen flex-col items-center justify-between p-24">
                        <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
                        <Button>Click me</Button>
                      </main>
                    )
                  }
                `
              }
            }
          }
        },
        components: {
          directory: {
            ui: {
              directory: {
                'button.tsx': {
                  file: {
                    contents: `
                      import * as React from "react"
                      import { Slot } from "@radix-ui/react-slot"
                      import { cva, type VariantProps } from "class-variance-authority"
                      import { cn } from "@/lib/utils"
                      
                      const buttonVariants = cva(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                        {
                          variants: {
                            variant: {
                              default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                              destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                              outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                              secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                              ghost: "hover:bg-accent hover:text-accent-foreground",
                              link: "text-primary underline-offset-4 hover:underline",
                            },
                            size: {
                              default: "h-9 px-4 py-2",
                              sm: "h-8 rounded-md px-3 text-xs",
                              lg: "h-10 rounded-md px-8",
                              icon: "h-9 w-9",
                            },
                          },
                          defaultVariants: {
                            variant: "default",
                            size: "default",
                          },
                        }
                      )
                      
                      export interface ButtonProps
                        extends React.ButtonHTMLAttributes<HTMLButtonElement>,
                          VariantProps<typeof buttonVariants> {
                        asChild?: boolean
                      }
                      
                      const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
                        ({ className, variant, size, asChild = false, ...props }, ref) => {
                          const Comp = asChild ? Slot : "button"
                          return (
                            <Comp
                              className={cn(buttonVariants({ variant, size, className }))}
                              ref={ref}
                              {...props}
                            />
                          )
                        }
                      )
                      Button.displayName = "Button"
                      
                      export { Button, buttonVariants }
                    `
                  }
                }
              }
            }
          }
        },
        lib: {
          directory: {
            'utils.ts': {
              file: {
                contents: `
                  import { type ClassValue, clsx } from "clsx"
                  import { twMerge } from "tailwind-merge"
                  
                  export function cn(...inputs: ClassValue[]) {
                    return twMerge(clsx(inputs))
                  }
                `
              }
            }
          }
        },
        styles: {
          directory: {
            'globals.css': {
              file: {
                contents: `
                  @tailwind base;
                  @tailwind components;
                  @tailwind utilities;
                  
                  @layer base {
                    :root {
                      --background: 0 0% 100%;
                      --foreground: 222.2 84% 4.9%;
                      --card: 0 0% 100%;
                      --card-foreground: 222.2 84% 4.9%;
                      --popover: 0 0% 100%;
                      --popover-foreground: 222.2 84% 4.9%;
                      --primary: 221.2 83.2% 53.3%;
                      --primary-foreground: 210 40% 98%;
                      --secondary: 210 40% 96.1%;
                      --secondary-foreground: 222.2 47.4% 11.2%;
                      --muted: 210 40% 96.1%;
                      --muted-foreground: 215.4 16.3% 46.9%;
                      --accent: 210 40% 96.1%;
                      --accent-foreground: 222.2 47.4% 11.2%;
                      --destructive: 0 84.2% 60.2%;
                      --destructive-foreground: 210 40% 98%;
                      --border: 214.3 31.8% 91.4%;
                      --input: 214.3 31.8% 91.4%;
                      --ring: 221.2 83.2% 53.3%;
                      --radius: 0.5rem;
                    }
                  
                    .dark {
                      --background: 222.2 84% 4.9%;
                      --foreground: 210 40% 98%;
                      --card: 222.2 84% 4.9%;
                      --card-foreground: 210 40% 98%;
                      --popover: 222.2 84% 4.9%;
                      --popover-foreground: 210 40% 98%;
                      --primary: 217.2 91.2% 59.8%;
                      --primary-foreground: 222.2 47.4% 11.2%;
                      --secondary: 217.2 32.6% 17.5%;
                      --secondary-foreground: 210 40% 98%;
                      --muted: 217.2 32.6% 17.5%;
                      --muted-foreground: 215 20.2% 65.1%;
                      --accent: 217.2 32.6% 17.5%;
                      --accent-foreground: 210 40% 98%;
                      --destructive: 0 62.8% 30.6%;
                      --destructive-foreground: 210 40% 98%;
                      --border: 217.2 32.6% 17.5%;
                      --input: 217.2 32.6% 17.5%;
                      --ring: 224.3 76.3% 48%;
                    }
                  }
                `
              }
            }
          }
        }
      }
    },
    'package.json': {
      file: {
        contents: `
          {
            "name": "nextjs-shadcn-template",
            "version": "0.1.0",
            "private": true,
            "scripts": {
              "dev": "next dev",
              "build": "next build",
              "start": "next start",
              "lint": "next lint"
            },
            "dependencies": {
              "@radix-ui/react-slot": "^1.0.2",
              "class-variance-authority": "^0.7.0",
              "clsx": "^2.0.0",
              "next": "14.1.0",
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "tailwind-merge": "^2.2.0",
              "tailwindcss-animate": "^1.0.7"
            },
            "devDependencies": {
              "@types/node": "^20.11.0",
              "@types/react": "^18.2.0",
              "@types/react-dom": "^18.2.0",
              "autoprefixer": "^10.4.16",
              "postcss": "^8.4.32",
              "tailwindcss": "^3.4.0",
              "typescript": "^5.3.0"
            }
          }
        `
      }
    },
    'tsconfig.json': {
      file: {
        contents: `
          {
            "compilerOptions": {
              "target": "es5",
              "lib": ["dom", "dom.iterable", "esnext"],
              "allowJs": true,
              "skipLibCheck": true,
              "strict": true,
              "noEmit": true,
              "esModuleInterop": true,
              "module": "esnext",
              "moduleResolution": "bundler",
              "resolveJsonModule": true,
              "isolatedModules": true,
              "jsx": "preserve",
              "incremental": true,
              "plugins": [
                {
                  "name": "next"
                }
              ],
              "paths": {
                "@/*": ["./src/*"]
              }
            },
            "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
            "exclude": ["node_modules"]
          }
        `
      }
    },
    'tailwind.config.js': {
      file: {
        contents: `
          /** @type {import('tailwindcss').Config} */
          module.exports = {
            darkMode: ["class"],
            content: [
              './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
              './src/components/**/*.{js,ts,jsx,tsx,mdx}',
              './src/app/**/*.{js,ts,jsx,tsx,mdx}',
            ],
            theme: {
              container: {
                center: true,
                padding: "2rem",
                screens: {
                  "2xl": "1400px",
                },
              },
              extend: {
                colors: {
                  border: "hsl(var(--border))",
                  input: "hsl(var(--input))",
                  ring: "hsl(var(--ring))",
                  background: "hsl(var(--background))",
                  foreground: "hsl(var(--foreground))",
                  primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                  },
                  secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                  },
                  destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                  },
                  muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                  },
                  accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                  },
                  popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                  },
                  card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                  },
                },
                borderRadius: {
                  lg: "var(--radius)",
                  md: "calc(var(--radius) - 2px)",
                  sm: "calc(var(--radius) - 4px)",
                },
              },
            },
            plugins: [require("tailwindcss-animate")],
          }
        `
      }
    },
    'postcss.config.js': {
      file: {
        contents: `
          module.exports = {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          }
        `
      }
    },
    '.gitignore': {
      file: {
        contents: `
          # dependencies
          /node_modules
          /.pnp
          .pnp.js
          .yarn/install-state.gz
          
          # testing
          /coverage
          
          # next.js
          /.next/
          /out/
          
          # production
          /build
          
          # misc
          .DS_Store
          *.pem
          
          # debug
          npm-debug.log*
          yarn-debug.log*
          yarn-error.log*
          
          # local env files
          .env*.local
          
          # vercel
          .vercel
          
          # typescript
          *.tsbuildinfo
          next-env.d.ts
        `
      }
    }
  };
  
  export default files;