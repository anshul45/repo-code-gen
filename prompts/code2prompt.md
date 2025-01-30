Project Path: virtual-stagging

Source Tree:

```
virtual-stagging
├── middleware.ts
├── messages
│   └── index.ts
├── types
│   ├── next-auth.d.ts
│   ├── index.ts
│   └── files.ts
├── logger
│   └── index.ts
├── app
│   ├── favicon.ico
│   ├── layout.tsx
│   ├── error.tsx
│   ├── api
│   │   ├── auth
│   │   │   ├── register
│   │   │   │   └── route.ts
│   │   │   └── [...nextauth]
│   │   │       └── route.ts
│   │   └── route.ts
│   ├── loading.tsx
│   ├── (auth)
│   │   ├── register
│   │   │   └── page.tsx
│   │   └── login
│   │       └── page.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   └── providers.tsx
├── config
│   └── index.ts
├── postcss.config.mjs
├── constants
│   ├── regex.ts
│   └── index.ts
├── next.config.mjs
├── prisma
│   └── schema.prisma
├── utils
│   ├── datetime.ts
│   ├── string.ts
│   ├── safety.ts
│   ├── index.ts
│   ├── files.ts
│   └── functions.ts
├── validations
│   ├── user.schema.ts
│   ├── post.schema.ts
│   └── index.ts
├── tailwind.config.ts
├── components
│   ├── ui
│   │   ├── aspect-ratio.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── pagination.tsx
│   │   ├── tabs.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── input-otp.tsx
│   │   ├── chart.tsx
│   │   ├── hover-card.tsx
│   │   ├── sheet.tsx
│   │   ├── scroll-area.tsx
│   │   ├── resizable.tsx
│   │   ├── label.tsx
│   │   ├── sonner.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── accordion.tsx
│   │   ├── drawer.tsx
│   │   ├── tooltip.tsx
│   │   ├── alert.tsx
│   │   ├── switch.tsx
│   │   ├── calendar.tsx
│   │   ├── password-input.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── radio-group.tsx
│   │   ├── command.tsx
│   │   ├── toggle-group.tsx
│   │   ├── avatar.tsx
│   │   ├── menubar.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── sidebar.tsx
│   │   ├── table.tsx
│   │   ├── separator.tsx
│   │   ├── button.tsx
│   │   ├── toggle.tsx
│   │   ├── toast.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   ├── context-menu.tsx
│   │   ├── form.tsx
│   │   └── carousel.tsx
│   ├── theme-providers.tsx
│   ├── CustomSidebar.tsx
│   └── ThemeToggle.tsx
├── jest.setup.ts
├── __tests__
│   └── pages
│       └── page.test.tsx
├── hooks
│   └── use-mobile.tsx
├── lib
│   ├── prisma.ts
│   ├── api-client.ts
│   ├── utils.ts
│   └── auth.ts
├── commitlint.config.js
├── deploy.sh
├── jest.config.ts
└── store
    ├── counterStore.ts
    ├── userStore.ts
    └── index.ts

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/middleware.ts`:

```ts
export { default } from 'next-auth/middleware';

export const config = { matcher: ['/dashboard(.*)'] };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/messages/index.ts`:

```ts
import { toast } from 'sonner';

class Notify {
	constructor() {}

	success(message: string) {
		toast.success(message);
	}

	error(error: any, fallback: string = 'Something went wrong') {
		if (typeof error === 'string') {
			toast.error(error);
		} else if (
			error.response &&
			error.response.data &&
			error.response.data.message &&
			typeof error.response.data.message === 'string'
		) {
			toast.error(error.response.data.message);
		} else if (error.message && typeof error.message === 'string') {
			toast.error(error.message);
		} else {
			toast.error(fallback);
		}
	}

	info(message: string) {
		toast.info(message);
	}

	warn(message: string) {
		toast.warning(message);
	}
}

const notify = new Notify();

export { notify };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/types/next-auth.d.ts`:

```ts
import 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			profilePicture?: string;
		};
	}
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/types/index.ts`:

```ts
export * from './files';

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/types/files.ts`:

```ts
export type FileExtension =
	| 'txt'
	| 'md'
	| 'json'
	| 'csv'
	| 'png'
	| 'jpg'
	| 'jpeg'
	| 'webp'
	| 'gif'
	| 'svg'
	| 'pdf'
	| 'doc'
	| 'docx'
	| 'xls'
	| 'xlsx'
	| 'ppt'
	| 'pptx'
	| 'mp3'
	| 'mp4'
	| 'mov'
	| 'avi'
	| 'mkv'
	| 'zip'
	| 'rar'
	| 'tar'
	| 'gz';

export type FileContentType =
	| 'text/plain'
	| 'text/markdown'
	| 'application/json'
	| 'text/csv'
	| 'image/png'
	| 'image/jpeg'
	| 'image/webp'
	| 'image/gif'
	| 'image/svg+xml'
	| 'application/pdf'
	| 'application/msword'
	| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	| 'application/vnd.ms-excel'
	| 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	| 'application/vnd.ms-powerpoint'
	| 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
	| 'audio/mpeg'
	| 'video/mp4'
	| 'video/quicktime'
	| 'video/x-msvideo'
	| 'video/x-matroska'
	| 'application/zip'
	| 'application/vnd.rar'
	| 'application/x-tar'
	| 'application/gzip';

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/logger/index.ts`:

```ts
import { createLogger, format, transports } from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const logsDir = 'logs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logFormat = format.printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = createLogger({
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true }),
		logFormat
	),
	transports: [
		new transports.File({
			filename: join(__dirname, logsDir, 'error.log'),
			level: 'error',
		}),

		new transports.File({
			filename: join(__dirname, logsDir, 'access.log'),
			level: 'debug',
			handleExceptions: true,
			format: format.combine(
				format((info) => {
					return info.level === 'error' ? false : info;
				})(),
				logFormat
			),
		}),

		new transports.Console({
			format: format.combine(format.colorize(), logFormat),
			level: 'debug',
		}),
	],
	exitOnError: false,
});

export default logger;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Nunito } from 'next/font/google';
import Loading from './loading';
import { Suspense } from 'react';
import Providers from './providers';

const nunito = Nunito({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Quickinit Next',
	description: 'Generated by create qi',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`antialiased ${nunito.className}`}>
				<Suspense fallback={<Loading />}>
					<Providers>
						<Toaster duration={2500} richColors closeButton position='top-right' />
						{children}
					</Providers>
				</Suspense>
			</body>
		</html>
	);
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/error.tsx`:

```tsx
'use client';
import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }) => {
	return (
		<div className='flex min-h-screen items-center justify-center bg-background p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<CardTitle className='mb-4 flex items-center justify-center'>
						<AlertTriangle className='mr-2 h-12 w-12 text-destructive' />
						Error Occurred
					</CardTitle>
					<CardDescription>Something unexpected happened</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='rounded-lg bg-muted/50 p-4'>
						<p className='break-words text-sm text-muted-foreground'>{error.message || 'An unknown error occurred'}</p>
						{error.digest && <p className='mt-2 text-xs text-muted-foreground'>Error ID: {error.digest}</p>}
					</div>

					<div className='flex justify-center space-x-4'>
						<Button variant='outline' className='w-full' onClick={() => reset()}>
							<RefreshCw className='mr-2 h-4 w-4' />
							Try Again
						</Button>
						<Button variant='secondary' className='w-full' asChild>
							<a href='/'>
								<Home className='mr-2 h-4 w-4' />
								Home
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ErrorPage;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/api/auth/register/route.ts`:

```ts
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const signupSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password is too long'),
	name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function POST(req: Request) {
	try {
		// Parse request body
		const body = await req.json();

		// Validate input
		const result = signupSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
		}

		const { email, password, name } = result.data;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json({ error: 'User already exists' }, { status: 409 });
		}

		// Hash password
		const hashedPassword = await hash(password, 12);

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
			select: {
				id: true,
				email: true,
				name: true,
				profilePicture: true,
				createdAt: true,
			},
		});

		return NextResponse.json(
			{
				message: 'User created successfully',
				user,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('[SIGNUP_ERROR]', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/api/auth/[...nextauth]/route.ts`:

```ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/api/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import logger from '@/logger';

export const GET = async (req: NextRequest) => {
	logger.info('Hello World');
	return NextResponse.json({ message: 'Hello World' }, { status: HttpStatusCode.Ok });
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/loading.tsx`:

```tsx
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Loading = () => {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
			<Card className='w-full max-w-sm'>
				<CardContent className='flex flex-col items-center justify-center space-y-4 p-6'>
					<Loader2 className='h-12 w-12 animate-spin text-primary' strokeWidth={1.5} />
					<div className='space-y-2 text-center'>
						<h2 className='text-xl font-semibold text-foreground'>Loading</h2>
						<p className='text-sm text-muted-foreground'>Preparing your content</p>
					</div>
					<div className='h-1 w-full overflow-hidden bg-primary/10'>
						<div className='animate-progress-bar h-full bg-primary'></div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Loading;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/(auth)/register/page.tsx`:

```tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { toast } from 'sonner';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/validations';
import { apiClient } from '@/lib/api-client';
import { User } from '@prisma/client';

export default function RegisterPage() {
	const [isLoading, setIsLoading] = React.useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: z.infer<typeof registerSchema>) {
		setIsLoading(true);
		try {
			const res = await apiClient.post<{ message: string; user: User }>('/api/auth/register', values);
			if (res.data) {
				toast.success('Account created successfully');
				router.push('/login');
			} else {
				toast.error(res.error?.message);
			}
		} catch (error) {
			toast.error('An error occurred');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='flex h-screen w-screen flex-col items-center justify-center'>
			<Card className='w-full max-w-lg'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-center text-2xl'>Create an account</CardTitle>
					<CardDescription className='text-center'>Enter your information to create your account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder='John Doe' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='example@email.com' type='email' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput placeholder='Create a password' {...field} />
										</FormControl>
										<FormDescription>
											Must contain at least 8 characters, one uppercase letter, and one number
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<PasswordInput placeholder='Confirm your password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className='w-full' disabled={isLoading}>
								{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Create Account
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className='flex flex-col space-y-4'>
					<div className='relative w-full'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-muted' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<Button variant='outline'>Google</Button>
						<Button variant='outline'>GitHub</Button>
					</div>
					<p className='text-center text-sm text-muted-foreground'>
						Already have an account?{' '}
						<Link href='/login' className='underline underline-offset-4 hover:text-primary'>
							Login here
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/(auth)/login/page.tsx`:

```tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/validations';

export default function LoginPage() {
	const [isLoading, setIsLoading] = React.useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true);
		const res = await signIn('credentials', {
			email: values.email,
			password: values.password,
			redirect: false,
		});
		if (res?.error) {
			toast.error('Invalid email or password');
		} else {
			router.push('/');
			toast.success('Logged in successfully');
		}
		setIsLoading(false);
	}

	return (
		<div className='flex h-screen w-screen flex-col items-center justify-center'>
			<Card className='mx-auto w-full max-w-lg'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-center text-2xl'>Welcome back</CardTitle>
					<CardDescription className='text-center'>
						Enter your email and password to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='example@email.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput placeholder='Enter your password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className='w-full' disabled={isLoading}>
								{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Sign In
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className='flex flex-col space-y-4'>
					<div className='relative w-full'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-muted' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<Button variant='outline'>Google</Button>
						<Button variant='outline'>GitHub</Button>
					</div>
					<p className='text-center text-sm text-muted-foreground'>
						Don&apos;t have an account?{' '}
						<Link href='/register' className='underline underline-offset-4 hover:text-primary'>
							Create an account
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/page.tsx`:

```tsx
import React from 'react';

const Page = () => {
	return <div>Hello World</div>;
};

export default Page;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
	font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
	.text-balance {
		text-wrap: balance;
	}
}

@layer base {
	:root {
		--background: 0 0% 100%;
		--foreground: 0 0% 3.9%;
		--card: 0 0% 100%;
		--card-foreground: 0 0% 3.9%;
		--popover: 0 0% 100%;
		--popover-foreground: 0 0% 3.9%;
		--primary: 0 0% 9%;
		--primary-foreground: 0 0% 98%;
		--secondary: 0 0% 96.1%;
		--secondary-foreground: 0 0% 9%;
		--muted: 0 0% 96.1%;
		--muted-foreground: 0 0% 45.1%;
		--accent: 0 0% 96.1%;
		--accent-foreground: 0 0% 9%;
		--destructive: 0 84.2% 60.2%;
		--destructive-foreground: 0 0% 98%;
		--border: 0 0% 89.8%;
		--input: 0 0% 89.8%;
		--ring: 0 0% 3.9%;
		--chart-1: 12 76% 61%;
		--chart-2: 173 58% 39%;
		--chart-3: 197 37% 24%;
		--chart-4: 43 74% 66%;
		--chart-5: 27 87% 67%;
		--radius: 0.5rem;
		--sidebar-background: 0 0% 98%;
		--sidebar-foreground: 240 5.3% 26.1%;
		--sidebar-primary: 240 5.9% 10%;
		--sidebar-primary-foreground: 0 0% 98%;
		--sidebar-accent: 240 4.8% 95.9%;
		--sidebar-accent-foreground: 240 5.9% 10%;
		--sidebar-border: 220 13% 91%;
		--sidebar-ring: 217.2 91.2% 59.8%;
	}
	.dark {
		--background: 0 0% 3.9%;
		--foreground: 0 0% 98%;
		--card: 0 0% 3.9%;
		--card-foreground: 0 0% 98%;
		--popover: 0 0% 3.9%;
		--popover-foreground: 0 0% 98%;
		--primary: 0 0% 98%;
		--primary-foreground: 0 0% 9%;
		--secondary: 0 0% 14.9%;
		--secondary-foreground: 0 0% 98%;
		--muted: 0 0% 14.9%;
		--muted-foreground: 0 0% 63.9%;
		--accent: 0 0% 14.9%;
		--accent-foreground: 0 0% 98%;
		--destructive: 0 62.8% 30.6%;
		--destructive-foreground: 0 0% 98%;
		--border: 0 0% 14.9%;
		--input: 0 0% 14.9%;
		--ring: 0 0% 83.1%;
		--chart-1: 220 70% 50%;
		--chart-2: 160 60% 45%;
		--chart-3: 30 80% 55%;
		--chart-4: 280 65% 60%;
		--chart-5: 340 75% 55%;
		--sidebar-background: 240 5.9% 10%;
		--sidebar-foreground: 240 4.8% 95.9%;
		--sidebar-primary: 224.3 76.3% 48%;
		--sidebar-primary-foreground: 0 0% 100%;
		--sidebar-accent: 240 3.7% 15.9%;
		--sidebar-accent-foreground: 240 4.8% 95.9%;
		--sidebar-border: 240 3.7% 15.9%;
		--sidebar-ring: 217.2 91.2% 59.8%;
	}
}

@layer base {
	* {
		@apply border-border;
	}
	body {
		@apply bg-background text-foreground;
	}
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/not-found.tsx`:

```tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Frown, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotFoundPage = () => {
	return (
		<div className='flex min-h-screen items-center justify-center bg-background p-4'>
			<Card className='w-full max-w-md text-center'>
				<CardHeader>
					<CardTitle className='flex items-center justify-center text-3xl'>
						<Frown className='mr-3 h-12 w-12 text-primary' />
						404 - Page Not Found
					</CardTitle>
					<CardDescription className='text-base'>
						Oops! The page you&apos;re looking for doesn&apos;t exist.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='rounded-lg border border-dashed border-primary/20 bg-muted/10 p-6'>
						<p className='text-muted-foreground'>
							The requested URL might have been removed, renamed, or temporarily unavailable.
						</p>
					</div>
					<div className='flex flex-col space-y-4'>
						<Button asChild className='w-full'>
							<Link href='/'>
								<Home className='mr-2 h-4 w-4' />
								Return to Home
							</Link>
						</Button>
						<Button variant='outline' className='w-full' onClick={() => window.history.back()}>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Go Back
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default NotFoundPage;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/app/providers.tsx`:

```tsx
'use client';
import { ThemeProvider } from '@/components/theme-providers';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<SessionProvider>
			<ThemeProvider attribute='class' defaultTheme='system' disableTransitionOnChange>
				<TooltipProvider>{children}</TooltipProvider>
			</ThemeProvider>
		</SessionProvider>
	);
};

export default Providers;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/config/index.ts`:

```ts
export const appUrl = process.env.APP_URL || 'http://localhost:3000';
export const PROTECTED_ROUTES = ['/dashboard(.*)'];

export const node_env: 'development' | 'production' | 'test' = process.env.NODE_ENV || 'development';

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'my-secret';
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/postcss.config.mjs`:

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		tailwindcss: {},
	},
};

export default config;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/constants/regex.ts`:

```ts
export const regex = {
	// email should be a valid email, contain @ and . and have a length of 2-5 characters
	email: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
	// password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
	// phone should be a valid phone number, contain only numbers and have a length of 10 characters
	phone: /^\d{10}$/,
	// name should be a valid name, contain only letters and spaces and have a length of 2-30 characters
	name: /^[a-zA-Z ]{2,30}$/,
	// avatar should be a valid url or empty string, a valid url should start with http:// or https:// and end with .png, .jpg, .jpeg, .gif, .svg or .webp or it can be data:image/png;base64, or data:image/jpeg;base64, or data:image/gif;base64, or data:image/svg+xml;base64,
	avatar:
		/^(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)(.png|.jpg|.jpeg|.gif|.svg|.webp)$|^data:image\/(png|jpeg|gif|svg\+xml);base64,/,
	// otp should be a valid otp, contain only numbers and have a length of 6 characters
	otp: /^[0-9\b]+$/,
	// location should be a valid location, contain letters, spaces, special characters and have a length of 2-30 characters
	location: /^[a-zA-Z0-9 !@#$%^&*)(,+=._-]{2,50}$/,
	// username should be a valid string, cannot contain spaces and have a length of 2-30 characters
	username: /^[a-zA-Z0-9]{2,30}$/,
	// URL
	url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/constants/index.ts`:

```ts
export * from './regex';

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/next.config.mjs`:

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
		dangerouslyAllowSVG: true,
	},
};

export default nextConfig;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/prisma/schema.prisma`:

```prisma
generator client {
	provider = "prisma-client-js"
}

datasource db {
	provider = "mongodb"
	url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  email           String    @unique
  name            String
  password        String
  profilePicture  String?   @map("profile_picture")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  @@map("users")
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/utils/datetime.ts`:

```ts
import {
	addDays,
	differenceInDays,
	format,
	formatDistanceToNow,
	isAfter,
	isToday,
	isTomorrow,
	isValid,
	isYesterday,
	parseISO,
	subDays,
} from 'date-fns';

export const getRelativeTime = (date: string | Date) => {
	return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export function isValidDate(date: any) {
	return isValid(date);
}

export const formatDate = (dateString: string | Date) => {
	const date = new Date(dateString);
	return format(date, 'dd MMM yyyy');
};

export const getTimeFromDate = (date: Date | string) => {
	return format(new Date(date), 'hh:mm a');
};

export const checkIfDateIsInFuture = (date: Date | string) => {
	return isAfter(new Date(date), new Date());
};

export const sanitizeTimeStampToDate = (timestamp: string) => {
	const date = new Date(timestamp);
	if (isValidDate(date)) {
		return date;
	}
	return null;
};

export const getCurrentTimestamp = () => {
	return Date.now();
};

export function parseDate(isoString: string) {
	return parseISO(isoString);
}

export function checkIsToday(date: Date | string) {
	return isToday(date);
}

export function checkIsTomorrow(date: Date | string) {
	return isTomorrow(date);
}

export function checkIsYesterday(date: Date | string) {
	return isYesterday(date);
}

export function addDaysToDate(date: Date | string, days: number) {
	return addDays(date, days);
}

export function subtractDaysFromDate(date: Date | string, days: number) {
	return subDays(date, days);
}

export function getDifferenceInDays(date1: Date | string, date2: Date | string) {
	return differenceInDays(date1, date2);
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/utils/string.ts`:

```ts
export function toCamelCase(string: string) {
	return string.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

export function toKebabCase(string: string) {
	return string
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();
}

export function toSnakeCase(string: string) {
	return string
		.replace(/([a-z])([A-Z])/g, '$1_$2')
		.replace(/[\s-]+/g, '_')
		.toLowerCase();
}

export function removeSpecialChars(string: string) {
	return string.replace(/[^a-zA-Z0-9 ]/g, '');
}

export function isEmpty(string: string) {
	return !string || string.trim().length === 0;
}

export function truncate(string: string, length: number, suffix = '...') {
	if (!string || string.length <= length) return string;
	return string.slice(0, length).trim() + suffix;
}

export function countOccurrences(string: string, searchString: string) {
	return string.split(searchString).length - 1;
}

export const slugify = (text: string) =>
	text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w-]+/g, '') // Remove all non-word chars
		.replace(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text

export function extractNumbers(string: string) {
	return string.replace(/[^0-9]/g, '');
}

export function isAlphabetic(string: string) {
	return /^[A-Za-z]+$/.test(string);
}

export function isNumeric(string: string) {
	return /^[0-9]+$/.test(string);
}

export const enumToText = (text: string) => {
	return text
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
};

export const capitalizeFirstLetter = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeEachWord = (text: string) => {
	return text.split(' ').map(capitalizeFirstLetter).join(' ');
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/utils/safety.ts`:

```ts
import { z } from 'zod';

export const safeParse = <T>(parse: (_: any) => T, input: any): T => {
	try {
		const output = parse(input);
		return output;
	} catch {
		// return null;
		throw new Error(`Invalid input: ${input}`);
	}
};

export const getString = (input: any): string => {
	return z.string().parse(input);
};

export const getNonEmptyString = (input: any): string => {
	return z.string().min(1).parse(input);
};

export const getNumber = (input: any): number => {
	return z.number().or(z.string().regex(/^\d+$/).transform(Number)).parse(input);
};

export const getNonNegativeNumber = (input: any): number => {
	return z.number().min(0).or(z.string().regex(/^\d+$/).transform(Number)).parse(input);
};

export const getBoolean = (input: any): boolean => {
	return z
		.boolean()
		.or(z.enum(['true', 'false']).transform((val) => val === 'true'))
		.or(
			z
				.number()
				.min(0)
				.max(1)
				.transform((val) => Boolean(val))
		)
		.parse(input);
};

export const getArray = <T>(input: any): T[] => {
	return z.array(z.any()).parse(input);
};

export const getSingletonValue = <T>(input: T[]): T => {
	if (input.length !== 1) {
		throw new Error(`${input} is not a singleton array!`);
	}

	return input[0];
};

export const getNonNullValue = <T>(input: T | null): T => {
	if (input === null || input === undefined) {
		throw new Error(`${input} is null!`);
	}

	return input;
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/utils/index.ts`:

```ts
export * from './files';
export * from './functions';
export * from './string';
export * from './datetime';
export * from './safety';

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/utils/files.ts`:

```ts
import { FileExtension, FileContentType } from '@/types/files';

export const fileExtensions = new Map<FileExtension, FileContentType>([
	['txt', 'text/plain'],
	['md', 'text/markdown'],
	['json', 'application/json'],
	['csv', 'text/csv'],
	['png', 'image/png'],
	['jpg', 'image/jpeg'],
	['jpeg', 'image/jpeg'],
	['webp', 'image/webp'],
	['gif', 'image/gif'],
	['svg', 'image/svg+xml'],
	['pdf', 'application/pdf'],
	['doc', 'application/msword'],
	['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	['xls', 'application/vnd.ms-excel'],
	['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
	['ppt', 'application/vnd.ms-powerpoint'],
	['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
	['mp3', 'audio/mpeg'],
	['mp4', 'video/mp4'],
	['mov', 'video/quicktime'],
	['avi', 'video/x-msvideo'],
	['mkv', 'video/x-matroska'],
	['zip', 'application/zip'],
	['rar', 'application/vnd.rar'],
	['tar', 'application/x-tar'],
	['gz', 'application/gzip'],
]);

export const getContentType = (extension: FileExtension) => {
	return fileExtensions.get(extension) || 'text/plain';
};

export const getExtension = (contentType: FileContentType) => {
	return Array.from(fileExtensions.entries()).find(([_, value]) => value === contentType)?.[0] || 'txt';
};

export const saveFile = (content: string, name: string, extension: FileExtension) => {
	const blob = new Blob([content], { type: getContentType(extension) });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${name}.${extension}`;
	link.click();
	window.URL.revokeObjectURL(url);
	if (link.parentNode) {
		link.parentNode.removeChild(link);
	}
};

export const readFile = (file: File) => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = () => {
			reject(reader.error);
		};
		reader.readAsDataURL(file);
	});
};

export const exportAsJSON = (data: any, name: string) => {
	const json = JSON.stringify(data, null, 2);
	saveFile(json, name, 'json');
};

export const jsonToCsv = (json: any[]) => {
	const replacer = (_: any, value: any) => (value === null ? '' : value);
	const header = Object.keys(json[0]);
	const csv = json.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
	csv.unshift(header.join(','));
	return csv.join('\r\n');
};

export const exportAsCSV = (data: any[], name: string) => {
	const csv = jsonToCsv(data);
	saveFile(csv, name, 'csv');
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/utils/functions.ts`:

```ts
export const roundOff = (number: number, decimalPlaces: number) => {
	return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
};

export const getRandomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sleep = (seconds: number) => {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const getRandomItemFromArray = <T>(array: T[]) => {
	return array[getRandomNumber(0, array.length - 1)];
};

export const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
};

export const openLinkInNewTab = (url: string) => {
	window.open(url, '_blank');
};

export const max = (a: number, b: number) => {
	return a > b ? a : b;
};

export const min = (a: number, b: number) => {
	return a < b ? a : b;
};

export const debounce = (func: any, delay: number) => {
	let timeout: NodeJS.Timeout;
	return (e: any) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(e);
		}, delay);
	};
};

export const randomId = () => Math.floor(Math.random() * 1000000000);

export const getRandomColor = () => {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const omitKeys = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]) => {
	const newObj = { ...obj };
	keys.forEach((key) => {
		delete newObj[key];
	});
	return newObj;
};

export const pickKeys = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]) => {
	const newObj = {} as T;
	keys.forEach((key) => {
		newObj[key] = obj[key];
	});
	return newObj;
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/validations/user.schema.ts`:

```ts
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one number'
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const UserSchema = z.object({
	id: z.string().uuid({ message: 'Invalid UUID format' }),
	name: z.string().min(2, 'Name must be at least 2 characters long'),
	email: z.string().email('Invalid email address'),
	age: z.number().int().optional(), // Optional field
});

export const CreateUserSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters long'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type User = z.infer<typeof UserSchema>;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/validations/post.schema.ts`:

```ts
import { z } from 'zod';

export const PostSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(5, 'Title must be at least 5 characters long'),
	content: z.string().min(20, 'Content must be at least 20 characters long'),
	authorId: z.string().uuid(),
});

export const CreatePostSchema = z.object({
	title: z.string().min(5, 'Title must be at least 5 characters long'),
	content: z.string().min(20, 'Content must be at least 20 characters long'),
});

export type Post = z.infer<typeof PostSchema>;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/validations/index.ts`:

```ts
export * from './user.schema';
export * from './post.schema';

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
export default config;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/aspect-ratio.tsx`:

```tsx
'use client';

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/alert-dialog.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Overlay
		className={cn(
			'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className
		)}
		{...props}
		ref={ref}
	/>
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
	<AlertDialogPortal>
		<AlertDialogOverlay />
		<AlertDialogPrimitive.Content
			ref={ref}
			className={cn(
				'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
				className
			)}
			{...props}
		/>
	</AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Action>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel
		ref={ref}
		className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
		{...props}
	/>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/pagination.tsx`:

```tsx
import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
	<nav
		role='navigation'
		aria-label='pagination'
		className={cn('mx-auto flex w-full justify-center', className)}
		{...props}
	/>
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
	({ className, ...props }, ref) => (
		<ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
	)
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
	<li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
	React.ComponentProps<'a'>;

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
	<a
		aria-current={isActive ? 'page' : undefined}
		className={cn(
			buttonVariants({
				variant: isActive ? 'outline' : 'ghost',
				size,
			}),
			className
		)}
		{...props}
	/>
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink aria-label='Go to previous page' size='default' className={cn('gap-1 pl-2.5', className)} {...props}>
		<ChevronLeft className='h-4 w-4' />
		<span>Previous</span>
	</PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink aria-label='Go to next page' size='default' className={cn('gap-1 pr-2.5', className)} {...props}>
		<span>Next</span>
		<ChevronRight className='h-4 w-4' />
	</PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
	<span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
		<MoreHorizontal className='h-4 w-4' />
		<span className='sr-only'>More pages</span>
	</span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/tabs.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
			className
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
			className
		)}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			className
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/card.tsx`:

```tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('rounded-xl border bg-card text-card-foreground shadow', className)} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
	)
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
	)
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
	)
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/slider.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn('relative flex w-full touch-none select-none items-center', className)}
		{...props}
	>
		<SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
			<SliderPrimitive.Range className='absolute h-full bg-primary' />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className='block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/popover.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Content
			ref={ref}
			align={align}
			sideOffset={sideOffset}
			className={cn(
				'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className
			)}
			{...props}
		/>
	</PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/progress.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className='h-full w-full flex-1 bg-primary transition-all'
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/input-otp.tsx`:

```tsx
'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
	({ className, containerClassName, ...props }, ref) => (
		<OTPInput
			ref={ref}
			containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
			className={cn('disabled:cursor-not-allowed', className)}
			{...props}
		/>
	)
);
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center', className)} {...props} />
);
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
	React.ElementRef<'div'>,
	React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
	const inputOTPContext = React.useContext(OTPInputContext);
	const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

	return (
		<div
			ref={ref}
			className={cn(
				'relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
				isActive && 'z-10 ring-1 ring-ring',
				className
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
					<div className='animate-caret-blink h-4 w-px bg-foreground duration-1000' />
				</div>
			)}
		</div>
	);
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
	({ ...props }, ref) => (
		<div ref={ref} role='separator' {...props}>
			<Minus />
		</div>
	)
);
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/chart.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
	[k in string]: {
		label?: React.ReactNode;
		icon?: React.ComponentType;
	} & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

type ChartContextProps = {
	config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
	const context = React.useContext(ChartContext);

	if (!context) {
		throw new Error('useChart must be used within a <ChartContainer />');
	}

	return context;
}

const ChartContainer = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		config: ChartConfig;
		children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
	}
>(({ id, className, children, config, ...props }, ref) => {
	const uniqueId = React.useId();
	const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

	return (
		<ChartContext.Provider value={{ config }}>
			<div
				data-chart={chartId}
				ref={ref}
				className={cn(
					"flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
					className
				)}
				{...props}
			>
				<ChartStyle id={chartId} config={config} />
				<RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	);
});
ChartContainer.displayName = 'Chart';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
	const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);

	if (!colorConfig.length) {
		return null;
	}

	return (
		<style
			dangerouslySetInnerHTML={{
				__html: Object.entries(THEMES)
					.map(
						([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
	.map(([key, itemConfig]) => {
		const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
		return color ? `  --color-${key}: ${color};` : null;
	})
	.join('\n')}
}
`
					)
					.join('\n'),
			}}
		/>
	);
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
		React.ComponentProps<'div'> & {
			hideLabel?: boolean;
			hideIndicator?: boolean;
			indicator?: 'line' | 'dot' | 'dashed';
			nameKey?: string;
			labelKey?: string;
		}
>(
	(
		{
			active,
			payload,
			className,
			indicator = 'dot',
			hideLabel = false,
			hideIndicator = false,
			label,
			labelFormatter,
			labelClassName,
			formatter,
			color,
			nameKey,
			labelKey,
		},
		ref
	) => {
		const { config } = useChart();

		const tooltipLabel = React.useMemo(() => {
			if (hideLabel || !payload?.length) {
				return null;
			}

			const [item] = payload;
			const key = `${labelKey || item.dataKey || item.name || 'value'}`;
			const itemConfig = getPayloadConfigFromPayload(config, item, key);
			const value =
				!labelKey && typeof label === 'string'
					? config[label as keyof typeof config]?.label || label
					: itemConfig?.label;

			if (labelFormatter) {
				return <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>;
			}

			if (!value) {
				return null;
			}

			return <div className={cn('font-medium', labelClassName)}>{value}</div>;
		}, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

		if (!active || !payload?.length) {
			return null;
		}

		const nestLabel = payload.length === 1 && indicator !== 'dot';

		return (
			<div
				ref={ref}
				className={cn(
					'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
					className
				)}
			>
				{!nestLabel ? tooltipLabel : null}
				<div className='grid gap-1.5'>
					{payload.map((item, index) => {
						const key = `${nameKey || item.name || item.dataKey || 'value'}`;
						const itemConfig = getPayloadConfigFromPayload(config, item, key);
						const indicatorColor = color || item.payload.fill || item.color;

						return (
							<div
								key={item.dataKey}
								className={cn(
									'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
									indicator === 'dot' && 'items-center'
								)}
							>
								{formatter && item?.value !== undefined && item.name ? (
									formatter(item.value, item.name, item, index, item.payload)
								) : (
									<>
										{itemConfig?.icon ? (
											<itemConfig.icon />
										) : (
											!hideIndicator && (
												<div
													className={cn('shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]', {
														'h-2.5 w-2.5': indicator === 'dot',
														'w-1': indicator === 'line',
														'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
														'my-0.5': nestLabel && indicator === 'dashed',
													})}
													style={
														{
															'--color-bg': indicatorColor,
															'--color-border': indicatorColor,
														} as React.CSSProperties
													}
												/>
											)
										)}
										<div
											className={cn(
												'flex flex-1 justify-between leading-none',
												nestLabel ? 'items-end' : 'items-center'
											)}
										>
											<div className='grid gap-1.5'>
												{nestLabel ? tooltipLabel : null}
												<span className='text-muted-foreground'>{itemConfig?.label || item.name}</span>
											</div>
											{item.value && (
												<span className='font-mono font-medium tabular-nums text-foreground'>
													{item.value.toLocaleString()}
												</span>
											)}
										</div>
									</>
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
);
ChartTooltipContent.displayName = 'ChartTooltip';

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> &
		Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
			hideIcon?: boolean;
			nameKey?: string;
		}
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey }, ref) => {
	const { config } = useChart();

	if (!payload?.length) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn('flex items-center justify-center gap-4', verticalAlign === 'top' ? 'pb-3' : 'pt-3', className)}
		>
			{payload.map((item) => {
				const key = `${nameKey || item.dataKey || 'value'}`;
				const itemConfig = getPayloadConfigFromPayload(config, item, key);

				return (
					<div
						key={item.value}
						className={cn('flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground')}
					>
						{itemConfig?.icon && !hideIcon ? (
							<itemConfig.icon />
						) : (
							<div
								className='h-2 w-2 shrink-0 rounded-[2px]'
								style={{
									backgroundColor: item.color,
								}}
							/>
						)}
						{itemConfig?.label}
					</div>
				);
			})}
		</div>
	);
});
ChartLegendContent.displayName = 'ChartLegend';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
	if (typeof payload !== 'object' || payload === null) {
		return undefined;
	}

	const payloadPayload =
		'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
			? payload.payload
			: undefined;

	let configLabelKey: string = key;

	if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
		configLabelKey = payload[key as keyof typeof payload] as string;
	} else if (
		payloadPayload &&
		key in payloadPayload &&
		typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
	) {
		configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
	}

	return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/hover-card.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { cn } from '@/lib/utils';

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
	React.ElementRef<typeof HoverCardPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
	<HoverCardPrimitive.Content
		ref={ref}
		align={align}
		sideOffset={sideOffset}
		className={cn(
			'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...props}
	/>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/sheet.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Overlay
		className={cn(
			'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className
		)}
		{...props}
		ref={ref}
	/>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
	'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
	{
		variants: {
			side: {
				top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
				bottom:
					'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
				left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
				right:
					'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
			},
		},
		defaultVariants: {
			side: 'right',
		},
	}
);

interface SheetContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
		VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
	({ side = 'right', className, children, ...props }, ref) => (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
				<SheetPrimitive.Close className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'>
					<X className='h-4 w-4' />
					<span className='sr-only'>Close</span>
				</SheetPrimitive.Close>
				{children}
			</SheetPrimitive.Content>
		</SheetPortal>
	)
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
	Sheet,
	SheetPortal,
	SheetOverlay,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/scroll-area.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
		<ScrollAreaPrimitive.Viewport className='h-full w-full rounded-[inherit]'>{children}</ScrollAreaPrimitive.Viewport>
		<ScrollBar />
		<ScrollAreaPrimitive.Corner />
	</ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			'flex touch-none select-none transition-colors',
			orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
			orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
			className
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb className='relative flex-1 rounded-full bg-border' />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/resizable.tsx`:

```tsx
'use client';

import { GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
	<ResizablePrimitive.PanelGroup
		className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
		{...props}
	/>
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
	withHandle,
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
	withHandle?: boolean;
}) => (
	<ResizablePrimitive.PanelResizeHandle
		className={cn(
			'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
			className
		)}
		{...props}
	>
		{withHandle && (
			<div className='z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border'>
				<GripVertical className='h-2.5 w-2.5' />
			</div>
		)}
	</ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/label.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
	<LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/sonner.tsx`:

```tsx
'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className='toaster group'
			toastOptions={{
				classNames: {
					toast:
						'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
					description: 'group-[.toast]:text-muted-foreground',
					actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
					cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/navigation-menu.tsx`:

```tsx
import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const NavigationMenu = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Root
		ref={ref}
		className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
		{...props}
	>
		{children}
		<NavigationMenuViewport />
	</NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
		{...props}
	/>
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
	'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
);

const NavigationMenuTrigger = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Trigger
		ref={ref}
		className={cn(navigationMenuTriggerStyle(), 'group', className)}
		{...props}
	>
		{children}{' '}
		<ChevronDown
			className='relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180'
			aria-hidden='true'
		/>
	</NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Content
		ref={ref}
		className={cn(
			'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
			className
		)}
		{...props}
	/>
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
	<div className={cn('absolute left-0 top-full flex justify-center')}>
		<NavigationMenuPrimitive.Viewport
			className={cn(
				'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
				className
			)}
			ref={ref}
			{...props}
		/>
	</div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Indicator
		ref={ref}
		className={cn(
			'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
			className
		)}
		{...props}
	>
		<div className='relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md' />
	</NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
	navigationMenuTriggerStyle,
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuIndicator,
	NavigationMenuViewport,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/accordion.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className='flex'>
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
				className
			)}
			{...props}
		>
			{children}
			<ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200' />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className='overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
		{...props}
	>
		<div className={cn('pb-4 pt-0', className)}>{children}</div>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/drawer.tsx`:

```tsx
'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
	<DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DrawerPortal>
		<DrawerOverlay />
		<DrawerPrimitive.Content
			ref={ref}
			className={cn(
				'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
				className
			)}
			{...props}
		>
			<div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted' />
			{children}
		</DrawerPrimitive.Content>
	</DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Title
		ref={ref}
		className={cn('text-lg font-semibold leading-none tracking-tight', className)}
		{...props}
	/>
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
	Drawer,
	DrawerPortal,
	DrawerOverlay,
	DrawerTrigger,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/tooltip.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Portal>
		<TooltipPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className
			)}
			{...props}
		/>
	</TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/alert.tsx`:

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
	'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
	{
		variants: {
			variant: {
				default: 'bg-background text-foreground',
				destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
	<div ref={ref} role='alert' className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
	)
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
	)
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/switch.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
			className
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/calendar.tsx`:

```tsx
'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month: 'space-y-4',
				caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'text-sm font-medium',
				nav: 'space-x-1 flex items-center',
				nav_button: cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
				),
				nav_button_previous: 'absolute left-1',
				nav_button_next: 'absolute right-1',
				table: 'w-full border-collapse space-y-1',
				head_row: 'flex',
				head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
				row: 'flex w-full mt-2',
				cell: cn(
					'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
					props.mode === 'range'
						? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
						: '[&:has([aria-selected])]:rounded-md'
				),
				day: cn(buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0 font-normal aria-selected:opacity-100'),
				day_range_start: 'day-range-start',
				day_range_end: 'day-range-end',
				day_selected:
					'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
				day_today: 'bg-accent text-accent-foreground',
				day_outside: 'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
				day_disabled: 'text-muted-foreground opacity-50',
				day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
				day_hidden: 'invisible',
				...classNames,
			}}
			components={{
				IconLeft: ({ ...props }) => <ChevronLeft className='h-4 w-4' />,
				IconRight: ({ ...props }) => <ChevronRight className='h-4 w-4' />,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = 'Calendar';

export { Calendar };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/password-input.tsx`:

```tsx
'use client';

import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);
		const disabled = props.value === '' || props.value === undefined || props.disabled;

		return (
			<div className='relative'>
				<Input
					type={showPassword ? 'text' : 'password'}
					className={cn('hide-password-toggle pr-10', className)}
					ref={ref}
					{...props}
				/>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
					onClick={() => setShowPassword((prev) => !prev)}
					disabled={disabled}
				>
					{showPassword && !disabled ? (
						<EyeIcon className='h-4 w-4' aria-hidden='true' />
					) : (
						<EyeOffIcon className='h-4 w-4' aria-hidden='true' />
					)}
					<span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
				</Button>

				{/* hides browsers password toggles */}
				<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
			</div>
		);
	}
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/breadcrumb.tsx`:

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

const Breadcrumb = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<'nav'> & {
		separator?: React.ReactNode;
	}
>(({ ...props }, ref) => <nav ref={ref} aria-label='breadcrumb' {...props} />);
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
	({ className, ...props }, ref) => (
		<ol
			ref={ref}
			className={cn(
				'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
				className
			)}
			{...props}
		/>
	)
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
	({ className, ...props }, ref) => (
		<li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
	)
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<'a'> & {
		asChild?: boolean;
	}
>(({ asChild, className, ...props }, ref) => {
	const Comp = asChild ? Slot : 'a';

	return <Comp ref={ref} className={cn('transition-colors hover:text-foreground', className)} {...props} />;
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
	({ className, ...props }, ref) => (
		<span
			ref={ref}
			role='link'
			aria-disabled='true'
			aria-current='page'
			className={cn('font-normal text-foreground', className)}
			{...props}
		/>
	)
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
	<li role='presentation' aria-hidden='true' className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)} {...props}>
		{children ?? <ChevronRight />}
	</li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
	<span
		role='presentation'
		aria-hidden='true'
		className={cn('flex h-9 w-9 items-center justify-center', className)}
		{...props}
	>
		<MoreHorizontal className='h-4 w-4' />
		<span className='sr-only'>More</span>
	</span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/radio-group.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
				<Circle className='h-3.5 w-3.5 fill-primary' />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/command.tsx`:

```tsx
'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
			className
		)}
		{...props}
	/>
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent className='overflow-hidden p-0'>
				<Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
		<Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		/>
	</div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
		{...props}
	/>
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className='py-6 text-center text-sm' {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
			className
		)}
		{...props}
	/>
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator ref={ref} className={cn('-mx-1 h-px bg-border', className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
			className
		)}
		{...props}
	/>
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;
};
CommandShortcut.displayName = 'CommandShortcut';

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/toggle-group.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle';

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
	size: 'default',
	variant: 'default',
});

const ToggleGroup = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
	<ToggleGroupPrimitive.Root ref={ref} className={cn('flex items-center justify-center gap-1', className)} {...props}>
		<ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
	</ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			ref={ref}
			className={cn(
				toggleVariants({
					variant: context.variant || variant,
					size: context.size || size,
				}),
				className
			)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/avatar.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
		{...props}
	/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/menubar.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Root
		ref={ref}
		className={cn('flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm', className)}
		{...props}
	/>
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Trigger
		ref={ref}
		className={cn(
			'flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
			className
		)}
		{...props}
	/>
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(({ className, inset, children, ...props }, ref) => (
	<MenubarPrimitive.SubTrigger
		ref={ref}
		className={cn(
			'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
			inset && 'pl-8',
			className
		)}
		{...props}
	>
		{children}
		<ChevronRight className='ml-auto h-4 w-4' />
	</MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.SubContent
		ref={ref}
		className={cn(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...props}
	/>
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }, ref) => (
	<MenubarPrimitive.Portal>
		<MenubarPrimitive.Content
			ref={ref}
			align={align}
			alignOffset={alignOffset}
			sideOffset={sideOffset}
			className={cn(
				'z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className
			)}
			{...props}
		/>
	</MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<MenubarPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			inset && 'pl-8',
			className
		)}
		{...props}
	/>
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<MenubarPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		checked={checked}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<MenubarPrimitive.ItemIndicator>
				<Check className='h-4 w-4' />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<MenubarPrimitive.RadioItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<MenubarPrimitive.ItemIndicator>
				<Circle className='h-4 w-4 fill-current' />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<MenubarPrimitive.Label
		ref={ref}
		className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
		{...props}
	/>
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;
};
MenubarShortcut.displayname = 'MenubarShortcut';

export {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
	MenubarSeparator,
	MenubarLabel,
	MenubarCheckboxItem,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarPortal,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarGroup,
	MenubarSub,
	MenubarShortcut,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/dialog.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className
		)}
		{...props}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPortal>
		<DialogOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
				className
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
				<X className='h-4 w-4' />
				<span className='sr-only'>Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn('text-lg font-semibold leading-none tracking-tight', className)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/badge.tsx`:

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
				secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
				outline: 'text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/sidebar.tsx`:

```tsx
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
	state: 'expanded' | 'collapsed';
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider.');
	}

	return context;
}

const SidebarProvider = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		defaultOpen?: boolean;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React.useState(false);

	// This is the internal state of the sidebar.
	// We use openProp and setOpenProp for control from outside the component.
	const [_open, _setOpen] = React.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React.useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === 'function' ? value(open) : value;
			if (setOpenProp) {
				setOpenProp(openState);
			} else {
				_setOpen(openState);
			}

			// This sets the cookie to keep the sidebar state.
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[setOpenProp, open]
	);

	// Helper to toggle the sidebar.
	const toggleSidebar = React.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [isMobile, setOpen, setOpenMobile]);

	// Adds a keyboard shortcut to toggle the sidebar.
	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [toggleSidebar]);

	// We add a state so that we can do data-state="expanded" or "collapsed".
	// This makes it easier to style the sidebar with Tailwind classes.
	const state = open ? 'expanded' : 'collapsed';

	const contextValue = React.useMemo<SidebarContext>(
		() => ({
			state,
			open,
			setOpen,
			isMobile,
			openMobile,
			setOpenMobile,
			toggleSidebar,
		}),
		[state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
	);

	return (
		<SidebarContext.Provider value={contextValue}>
			<TooltipProvider delayDuration={0}>
				<div
					style={
						{
							'--sidebar-width': SIDEBAR_WIDTH,
							'--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
							...style,
						} as React.CSSProperties
					}
					className={cn('group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar', className)}
					ref={ref}
					{...props}
				>
					{children}
				</div>
			</TooltipProvider>
		</SidebarContext.Provider>
	);
});
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		side?: 'left' | 'right';
		variant?: 'sidebar' | 'floating' | 'inset';
		collapsible?: 'offcanvas' | 'icon' | 'none';
	}
>(({ side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

	if (collapsible === 'none') {
		return (
			<div
				className={cn('flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground', className)}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		);
	}

	if (isMobile) {
		return (
			<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
				<SheetContent
					data-sidebar='sidebar'
					data-mobile='true'
					className='w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden'
					style={
						{
							'--sidebar-width': SIDEBAR_WIDTH_MOBILE,
						} as React.CSSProperties
					}
					side={side}
				>
					<div className='flex h-full w-full flex-col'>{children}</div>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<div
			ref={ref}
			className='group peer hidden text-sidebar-foreground md:block'
			data-state={state}
			data-collapsible={state === 'collapsed' ? collapsible : ''}
			data-variant={variant}
			data-side={side}
		>
			{/* This is what handles the sidebar gap on desktop */}
			<div
				className={cn(
					'relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear',
					'group-data-[collapsible=offcanvas]:w-0',
					'group-data-[side=right]:rotate-180',
					variant === 'floating' || variant === 'inset'
						? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
						: 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
				)}
			/>
			<div
				className={cn(
					'fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex',
					side === 'left'
						? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
						: 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
					// Adjust the padding for floating and inset variants.
					variant === 'floating' || variant === 'inset'
						? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
						: 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
					className
				)}
				{...props}
			>
				<div
					data-sidebar='sidebar'
					className='flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow'
				>
					{children}
				</div>
			</div>
		</div>
	);
});
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
	({ className, onClick, ...props }, ref) => {
		const { toggleSidebar } = useSidebar();

		return (
			<Button
				ref={ref}
				data-sidebar='trigger'
				variant='ghost'
				size='icon'
				className={cn('h-7 w-7', className)}
				onClick={(event) => {
					onClick?.(event);
					toggleSidebar();
				}}
				{...props}
			>
				<PanelLeft />
				<span className='sr-only'>Toggle Sidebar</span>
			</Button>
		);
	}
);
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
	({ className, ...props }, ref) => {
		const { toggleSidebar } = useSidebar();

		return (
			<button
				ref={ref}
				data-sidebar='rail'
				aria-label='Toggle Sidebar'
				tabIndex={-1}
				onClick={toggleSidebar}
				title='Toggle Sidebar'
				className={cn(
					'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
					'[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
					'[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
					'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar',
					'[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
					'[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
					className
				)}
				{...props}
			/>
		);
	}
);
SidebarRail.displayName = 'SidebarRail';

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<'main'>>(({ className, ...props }, ref) => {
	return (
		<main
			ref={ref}
			className={cn(
				'relative flex min-h-svh flex-1 flex-col bg-background',
				'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
				className
			)}
			{...props}
		/>
	);
});
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
	({ className, ...props }, ref) => {
		return (
			<Input
				ref={ref}
				data-sidebar='input'
				className={cn(
					'h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
					className
				)}
				{...props}
			/>
		);
	}
);
SidebarInput.displayName = 'SidebarInput';

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
	return <div ref={ref} data-sidebar='header' className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
	return <div ref={ref} data-sidebar='footer' className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
	({ className, ...props }, ref) => {
		return (
			<Separator
				ref={ref}
				data-sidebar='separator'
				className={cn('mx-2 w-auto bg-sidebar-border', className)}
				{...props}
			/>
		);
	}
);
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar='content'
			className={cn(
				'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
				className
			)}
			{...props}
		/>
	);
});
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar='group'
			className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
			{...props}
		/>
	);
});
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'> & { asChild?: boolean }>(
	({ className, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'div';

		return (
			<Comp
				ref={ref}
				data-sidebar='group-label'
				className={cn(
					'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
					'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
					className
				)}
				{...props}
			/>
		);
	}
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupAction = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'> & { asChild?: boolean }>(
	({ className, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				ref={ref}
				data-sidebar='group-action'
				className={cn(
					'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
					// Increases the hit area of the button on mobile.
					'after:absolute after:-inset-2 after:md:hidden',
					'group-data-[collapsible=icon]:hidden',
					className
				)}
				{...props}
			/>
		);
	}
);
SidebarGroupAction.displayName = 'SidebarGroupAction';

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
	({ className, ...props }, ref) => (
		<div ref={ref} data-sidebar='group-content' className={cn('w-full text-sm', className)} {...props} />
	)
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(({ className, ...props }, ref) => (
	<ul ref={ref} data-sidebar='menu' className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
	<li ref={ref} data-sidebar='menu-item' className={cn('group/menu-item relative', className)} {...props} />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
	'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
				outline:
					'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
			},
			size: {
				default: 'h-8 text-sm',
				sm: 'h-7 text-xs',
				lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

const SidebarMenuButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<'button'> & {
		asChild?: boolean;
		isActive?: boolean;
		tooltip?: string | React.ComponentProps<typeof TooltipContent>;
	} & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = 'default', size = 'default', tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	const { isMobile, state } = useSidebar();

	const button = (
		<Comp
			ref={ref}
			data-sidebar='menu-button'
			data-size={size}
			data-active={isActive}
			className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
			{...props}
		/>
	);

	if (!tooltip) {
		return button;
	}

	if (typeof tooltip === 'string') {
		tooltip = {
			children: tooltip,
		};
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent side='right' align='center' hidden={state !== 'collapsed' || isMobile} {...tooltip} />
		</Tooltip>
	);
});
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuAction = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<'button'> & {
		asChild?: boolean;
		showOnHover?: boolean;
	}
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			ref={ref}
			data-sidebar='menu-action'
			className={cn(
				'absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
				// Increases the hit area of the button on mobile.
				'after:absolute after:-inset-2 after:md:hidden',
				'peer-data-[size=sm]/menu-button:top-1',
				'peer-data-[size=default]/menu-button:top-1.5',
				'peer-data-[size=lg]/menu-button:top-2.5',
				'group-data-[collapsible=icon]:hidden',
				showOnHover &&
					'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0',
				className
			)}
			{...props}
		/>
	);
});
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			data-sidebar='menu-badge'
			className={cn(
				'pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground',
				'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
				'peer-data-[size=sm]/menu-button:top-1',
				'peer-data-[size=default]/menu-button:top-1.5',
				'peer-data-[size=lg]/menu-button:top-2.5',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	)
);
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

const SidebarMenuSkeleton = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		showIcon?: boolean;
	}
>(({ className, showIcon = false, ...props }, ref) => {
	// Random width between 50 to 90%.
	const width = React.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);

	return (
		<div
			ref={ref}
			data-sidebar='menu-skeleton'
			className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
			{...props}
		>
			{showIcon && <Skeleton className='size-4 rounded-md' data-sidebar='menu-skeleton-icon' />}
			<Skeleton
				className='h-4 max-w-[--skeleton-width] flex-1'
				data-sidebar='menu-skeleton-text'
				style={
					{
						'--skeleton-width': width,
					} as React.CSSProperties
				}
			/>
		</div>
	);
});
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
	({ className, ...props }, ref) => (
		<ul
			ref={ref}
			data-sidebar='menu-sub'
			className={cn(
				'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	)
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ ...props }, ref) => (
	<li ref={ref} {...props} />
));
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentProps<'a'> & {
		asChild?: boolean;
		size?: 'sm' | 'md';
		isActive?: boolean;
	}
>(({ asChild = false, size = 'md', isActive, className, ...props }, ref) => {
	const Comp = asChild ? Slot : 'a';

	return (
		<Comp
			ref={ref}
			data-sidebar='menu-sub-button'
			data-size={size}
			data-active={isActive}
			className={cn(
				'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
				'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
				size === 'sm' && 'text-xs',
				size === 'md' && 'text-sm',
				'group-data-[collapsible=icon]:hidden',
				className
			)}
			{...props}
		/>
	);
});
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/table.tsx`:

```tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => (
		<div className='relative w-full overflow-auto'>
			<table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
		</div>
	)
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
	)
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
	)
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
	({ className, ...props }, ref) => (
		<tr
			ref={ref}
			className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
			{...props}
		/>
	)
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<th
			ref={ref}
			className={cn(
				'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
				className
			)}
			{...props}
		/>
	)
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<td
			ref={ref}
			className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)}
			{...props}
		/>
	)
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
	({ className, ...props }, ref) => (
		<caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
	)
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/separator.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

const Separator = React.forwardRef<
	React.ElementRef<typeof SeparatorPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
	<SeparatorPrimitive.Root
		ref={ref}
		decorative={decorative}
		orientation={orientation}
		className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', className)}
		{...props}
	/>
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/button.tsx`:

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/toggle.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
			},
			size: {
				default: 'h-9 px-2 min-w-9',
				sm: 'h-8 px-1.5 min-w-8',
				lg: 'h-10 px-2.5 min-w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

const Toggle = React.forwardRef<
	React.ElementRef<typeof TogglePrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
	<TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/toast.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
			className
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
	{
		variants: {
			variant: {
				default: 'border bg-background text-foreground',
				destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

const Toast = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
	return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Action>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
			className
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Close>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
			className
		)}
		toast-close=''
		{...props}
	>
		<X className='h-4 w-4' />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold [&+div]:text-xs', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
	type ToastProps,
	type ToastActionElement,
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
	ToastAction,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/checkbox.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
			<Check className='h-4 w-4' />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/collapsible.tsx`:

```tsx
'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/dropdown-menu.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(({ className, inset, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		className={cn(
			'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
			inset && 'pl-8',
			className
		)}
		{...props}
	>
		{children}
		<ChevronRight className='ml-auto' />
	</DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.SubContent
		ref={ref}
		className={cn(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...props}
	/>
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
			inset && 'pl-8',
			className
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		checked={checked}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<DropdownMenuPrimitive.ItemIndicator>
				<Check className='h-4 w-4' />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<DropdownMenuPrimitive.ItemIndicator>
				<Circle className='h-2 w-2 fill-current' />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
		{...props}
	/>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />;
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/select.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
			className
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className='h-4 w-4 opacity-50' />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn('flex cursor-default items-center justify-center py-1', className)}
		{...props}
	>
		<ChevronUp className='h-4 w-4' />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn('flex cursor-default items-center justify-center py-1', className)}
		{...props}
	>
		<ChevronDown className='h-4 w-4' />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				position === 'popper' &&
					'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
				className
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport
				className={cn(
					'p-1',
					position === 'popper' &&
						'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		{...props}
	>
		<span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
			<SelectPrimitive.ItemIndicator>
				<Check className='h-4 w-4' />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/textarea.tsx`:

```tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = 'Textarea';

export { Textarea };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/input.tsx`:

```tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = 'Input';

export { Input };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/skeleton.tsx`:

```tsx
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/context-menu.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(({ className, inset, children, ...props }, ref) => (
	<ContextMenuPrimitive.SubTrigger
		ref={ref}
		className={cn(
			'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
			inset && 'pl-8',
			className
		)}
		{...props}
	>
		{children}
		<ChevronRight className='ml-auto h-4 w-4' />
	</ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.SubContent
		ref={ref}
		className={cn(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...props}
	/>
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.Content
			ref={ref}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className
			)}
			{...props}
		/>
	</ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<ContextMenuPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			inset && 'pl-8',
			className
		)}
		{...props}
	/>
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<ContextMenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		checked={checked}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<ContextMenuPrimitive.ItemIndicator>
				<Check className='h-4 w-4' />
			</ContextMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<ContextMenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<ContextMenuPrimitive.ItemIndicator>
				<Circle className='h-4 w-4 fill-current' />
			</ContextMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<ContextMenuPrimitive.Label
		ref={ref}
		className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', inset && 'pl-8', className)}
		{...props}
	/>
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;
};
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuCheckboxItem,
	ContextMenuRadioItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuGroup,
	ContextMenuPortal,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuRadioGroup,
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/form.tsx`:

```tsx
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Form = FormProvider;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>');
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const id = React.useId();

		return (
			<FormItemContext.Provider value={{ id }}>
				<div ref={ref} className={cn('space-y-2', className)} {...props} />
			</FormItemContext.Provider>
		);
	}
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
	const { error, formItemId } = useFormField();

	return <Label ref={ref} className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
	({ ...props }, ref) => {
		const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

		return (
			<Slot
				ref={ref}
				id={formItemId}
				aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
				aria-invalid={!!error}
				{...props}
			/>
		);
	}
);
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => {
		const { formDescriptionId } = useFormField();

		return (
			<p ref={ref} id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />
		);
	}
);
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, children, ...props }, ref) => {
		const { error, formMessageId } = useFormField();
		const body = error ? String(error?.message) : children;

		if (!body) {
			return null;
		}

		return (
			<p
				ref={ref}
				id={formMessageId}
				className={cn('text-[0.8rem] font-medium text-destructive', className)}
				{...props}
			>
				{body}
			</p>
		);
	}
);
FormMessage.displayName = 'FormMessage';

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ui/carousel.tsx`:

```tsx
'use client';

import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
	opts?: CarouselOptions;
	plugins?: CarouselPlugin;
	orientation?: 'horizontal' | 'vertical';
	setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0];
	api: ReturnType<typeof useEmblaCarousel>[1];
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
	const context = React.useContext(CarouselContext);

	if (!context) {
		throw new Error('useCarousel must be used within a <Carousel />');
	}

	return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
	({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
		const [carouselRef, api] = useEmblaCarousel(
			{
				...opts,
				axis: orientation === 'horizontal' ? 'x' : 'y',
			},
			plugins
		);
		const [canScrollPrev, setCanScrollPrev] = React.useState(false);
		const [canScrollNext, setCanScrollNext] = React.useState(false);

		const onSelect = React.useCallback((api: CarouselApi) => {
			if (!api) {
				return;
			}

			setCanScrollPrev(api.canScrollPrev());
			setCanScrollNext(api.canScrollNext());
		}, []);

		const scrollPrev = React.useCallback(() => {
			api?.scrollPrev();
		}, [api]);

		const scrollNext = React.useCallback(() => {
			api?.scrollNext();
		}, [api]);

		const handleKeyDown = React.useCallback(
			(event: React.KeyboardEvent<HTMLDivElement>) => {
				if (event.key === 'ArrowLeft') {
					event.preventDefault();
					scrollPrev();
				} else if (event.key === 'ArrowRight') {
					event.preventDefault();
					scrollNext();
				}
			},
			[scrollPrev, scrollNext]
		);

		React.useEffect(() => {
			if (!api || !setApi) {
				return;
			}

			setApi(api);
		}, [api, setApi]);

		React.useEffect(() => {
			if (!api) {
				return;
			}

			onSelect(api);
			api.on('reInit', onSelect);
			api.on('select', onSelect);

			return () => {
				api?.off('select', onSelect);
			};
		}, [api, onSelect]);

		return (
			<CarouselContext.Provider
				value={{
					carouselRef,
					api: api,
					opts,
					orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
					scrollPrev,
					scrollNext,
					canScrollPrev,
					canScrollNext,
				}}
			>
				<div
					ref={ref}
					onKeyDownCapture={handleKeyDown}
					className={cn('relative', className)}
					role='region'
					aria-roledescription='carousel'
					{...props}
				>
					{children}
				</div>
			</CarouselContext.Provider>
		);
	}
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const { carouselRef, orientation } = useCarousel();

		return (
			<div ref={carouselRef} className='overflow-hidden'>
				<div
					ref={ref}
					className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}
					{...props}
				/>
			</div>
		);
	}
);
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const { orientation } = useCarousel();

		return (
			<div
				ref={ref}
				role='group'
				aria-roledescription='slide'
				className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
				{...props}
			/>
		);
	}
);
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
	({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
		const { orientation, scrollPrev, canScrollPrev } = useCarousel();

		return (
			<Button
				ref={ref}
				variant={variant}
				size={size}
				className={cn(
					'absolute h-8 w-8 rounded-full',
					orientation === 'horizontal'
						? '-left-12 top-1/2 -translate-y-1/2'
						: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
					className
				)}
				disabled={!canScrollPrev}
				onClick={scrollPrev}
				{...props}
			>
				<ArrowLeft className='h-4 w-4' />
				<span className='sr-only'>Previous slide</span>
			</Button>
		);
	}
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
	({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
		const { orientation, scrollNext, canScrollNext } = useCarousel();

		return (
			<Button
				ref={ref}
				variant={variant}
				size={size}
				className={cn(
					'absolute h-8 w-8 rounded-full',
					orientation === 'horizontal'
						? '-right-12 top-1/2 -translate-y-1/2'
						: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
					className
				)}
				disabled={!canScrollNext}
				onClick={scrollNext}
				{...props}
			>
				<ArrowRight className='h-4 w-4' />
				<span className='sr-only'>Next slide</span>
			</Button>
		);
	}
);
CarouselNext.displayName = 'CarouselNext';

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/theme-providers.tsx`:

```tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/CustomSidebar.tsx`:

```tsx
import * as React from 'react';
import { LogOut, LucideProps } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

type SidebarRoute = {
	name: string;
	url: string;
	isAdmin: boolean;
	icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
};

export default function AppSidebar({ children, pages }: { children: React.ReactNode; pages: SidebarRoute[] }) {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
			<SidebarComponent pages={pages}>{children}</SidebarComponent>
		</SidebarProvider>
	);
}

export function SidebarComponent({ children, pages }: { children: React.ReactNode; pages: SidebarRoute[] }) {
	const { setOpenMobile } = useSidebar();
	const { data: session } = useSession();
	const user = session?.user;

	return (
		<>
			<Sidebar collapsible='icon'>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<Avatar className='flex h-8 w-8 items-center justify-center rounded-sm bg-transparent p-1'>
								<AvatarImage src={user?.profilePicture ?? undefined} className='rounded-sm' />
								<AvatarFallback className='rounded-sm'>
									{user?.name
										? user?.name
												.split(' ')
												.map((word) => word[0])
												.join('')
												.slice(0, 2)
												.toUpperCase()
										: 'QI'}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>{user?.name ?? 'Unknown'}</span>
								<span className='truncate text-xs'>{user?.email ?? 'Unknown'}</span>
							</div>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						<SidebarGroup className='gap-3'>
							{pages.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<Link href={item.url} onClick={() => setOpenMobile(false)} className='gap-3'>
											<item.icon className='!h-6' />
											<span>{item.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarGroup>
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={async () => {
									signOut();
								}}
							>
								<LogOut size={25} />
								<span>Logout</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset className='h-dvh overflow-hidden'>
				<header className='sticky top-0 flex h-12 w-full shrink-0 items-center justify-between gap-2 pr-6 transition-[width,height] ease-linear'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
					</div>
					<ThemeToggle />
				</header>
				<div className='h-[calc(100dvh-48px)] w-full overflow-auto bg-background px-3 py-0'>{children}</div>
			</SidebarInset>
		</>
	);
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/components/ThemeToggle.tsx`:

```tsx
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon'>
					<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/jest.setup.ts`:

```ts
import '@testing-library/jest-dom';

jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
}));

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/__tests__/pages/page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { useSession } from 'next-auth/react';

describe('Page', () => {
	it('renders unauthenticated state with main CTA', () => {
		(useSession as jest.Mock).mockReturnValue({
			data: null,
			status: 'unauthenticated',
		});

		render(<HomePage />);
	});

	it('renders authenticated state with user info', () => {
		(useSession as jest.Mock).mockReturnValue({
			data: {
				user: {
					name: 'Test User',
					email: 'test@example.com',
				},
			},
			status: 'authenticated',
		});

		render(<HomePage />);
	});
});

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/hooks/use-mobile.tsx`:

```tsx
import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener('change', onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener('change', onChange);
	}, []);

	return !!isMobile;
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/lib/prisma.ts`:

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/lib/api-client.ts`:

```ts
import { appUrl } from '@/config';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type ApiResult<T> = {
	data?: T;
	error?: {
		message: string;
		status: number;
	};
};

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: appUrl,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	private async request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
		try {
			const response: AxiosResponse<T> = await this.client.request(config);
			return { data: response.data };
		} catch (err) {
			const error = err as AxiosError;
			return {
				error: {
					message: error.message,
					status: error.response?.status || 500,
				},
			};
		}
	}

	async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'GET', url, params });
	}

	async post<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'POST', url, data });
	}

	async put<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'PUT', url, data });
	}

	async patch<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'PATCH', url, data });
	}

	async delete<T>(url: string): Promise<ApiResult<T>> {
		return this.request<T>({ method: 'DELETE', url });
	}
}

export const apiClient = new ApiClient();

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/lib/auth.ts`:

```ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user) {
					return null;
				}

				const isPasswordValid = await compare(credentials.password, user.password);

				if (!isPasswordValid) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					profilePicture: user.profilePicture,
				};
			},
		}),
	],
	callbacks: {
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
				},
			};
		},
		jwt: ({ token, user }) => {
			if (user) {
				return {
					...token,
					id: user.id,
				};
			}
			return token;
		},
	},
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/commitlint.config.js`:

```js
// build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
// ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests
// config: Changes to configuration files

module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'body-leading-blank': [1, 'always'],
		'body-min-length': [2, 'always', 10],
		'body-max-line-length': [2, 'always', 100],
		'footer-leading-blank': [1, 'always'],
		'footer-max-line-length': [2, 'always', 100],
		'header-max-length': [2, 'always', 100],
		'scope-case': [2, 'always', 'lower-case'],
		'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'config'],
		],
	},
};

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/deploy.sh`:

```sh
#!/bin/bash

REPO=$(hostname)
DEVTOOLS_SECRET="$1"  # Get secret from first argument

cd "$HOME/$REPO"
sudo su
git pull
pnpm install

# Fetch env file from API using the passed secret
ENV_CONTENT=$(curl -X POST \
  "https://tools-backend.dev.opengig.work/development/${REPO}/env" \
  -H "Content-Type: application/json" \
  -d "{\"apiKey\": \"${DEVTOOLS_SECRET}\"}")

# Write env content directly to file
echo "$ENV_CONTENT" > .env
pnpm build

pm2 describe website > /dev/null 2>&1
STATUS=$?

if [ $STATUS -eq 0 ]; then
    echo "PM2 process 'website' is running. Restarting it..."
    pm2 restart website
else
    echo "PM2 process 'website' is not running. Starting a new process..."
    pm2 start npm --name website -- start
fi

pm2 save
```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/jest.config.ts`:

```ts
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from 'next/jest.js';

import type { Config } from 'jest';

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

const config: Config = {
	// All imported modules in your tests should be mocked automatically
	// automock: false,

	// Stop running tests after `n` failures
	// bail: 0,

	// The directory where Jest should store its cached dependency information
	// cacheDirectory: "/private/var/folders/vw/mtmyjwg13mz9hd52gq4gtztw0000gn/T/jest_dx",

	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	// collectCoverageFrom: undefined,

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// An array of regexp pattern strings used to skip coverage collection
	// coveragePathIgnorePatterns: [
	//   "/node_modules/"
	// ],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: 'v8',

	// A list of reporter names that Jest uses when writing coverage reports
	// coverageReporters: [
	//   "json",
	//   "text",
	//   "lcov",
	//   "clover"
	// ],

	// An object that configures minimum threshold enforcement for coverage results
	// coverageThreshold: undefined,

	// A path to a custom dependency extractor
	// dependencyExtractor: undefined,

	// Make calling deprecated APIs throw helpful error messages
	// errorOnDeprecated: false,

	// The default configuration for fake timers
	// fakeTimers: {
	//   "enableGlobally": false
	// },

	// Force coverage collection from ignored files using an array of glob patterns
	// forceCoverageMatch: [],

	// A path to a module which exports an async function that is triggered once before all test suites
	// globalSetup: undefined,

	// A path to a module which exports an async function that is triggered once after all test suites
	// globalTeardown: undefined,

	// A set of global variables that need to be available in all test environments
	// globals: {},

	// The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
	// maxWorkers: "50%",

	// An array of directory names to be searched recursively up from the requiring module's location
	// moduleDirectories: [
	//   "node_modules"
	// ],

	// An array of file extensions your modules use
	// moduleFileExtensions: [
	//   "js",
	//   "mjs",
	//   "cjs",
	//   "jsx",
	//   "ts",
	//   "tsx",
	//   "json",
	//   "node"
	// ],

	// A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},

	// An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
	// modulePathIgnorePatterns: [],

	// Activates notifications for test results
	// notify: false,

	// An enum that specifies notification mode. Requires { notify: true }
	// notifyMode: "failure-change",

	// A preset that is used as a base for Jest's configuration
	// preset: undefined,

	// Run tests from one or more projects
	// projects: undefined,

	// Use this configuration option to add custom reporters to Jest
	// reporters: undefined,

	// Automatically reset mock state before every test
	// resetMocks: false,

	// Reset the module registry before running each individual test
	// resetModules: false,

	// A path to a custom resolver
	// resolver: undefined,

	// Automatically restore mock state and implementation before every test
	// restoreMocks: false,

	// The root directory that Jest should scan for tests and modules within
	// rootDir: undefined,

	// A list of paths to directories that Jest should use to search for files in
	// roots: [
	//   "<rootDir>"
	// ],

	// Allows you to use a custom runner instead of Jest's default test runner
	// runner: "jest-runner",

	// The paths to modules that run some code to configure or set up the testing environment before each test
	// setupFiles: [],

	// A list of paths to modules that run some code to configure or set up the testing framework before each test
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

	// The number of seconds after which a test is considered as slow and reported as such in the results.
	// slowTestThreshold: 5,

	// A list of paths to snapshot serializer modules Jest should use for snapshot testing
	// snapshotSerializers: [],

	// The test environment that will be used for testing
	testEnvironment: 'jest-environment-jsdom',

	// Options that will be passed to the testEnvironment
	// testEnvironmentOptions: {},

	// Adds a location field to test results
	// testLocationInResults: false,

	// The glob patterns Jest uses to detect test files
	// testMatch: [
	//   "**/__tests__/**/*.[jt]s?(x)",
	//   "**/?(*.)+(spec|test).[tj]s?(x)"
	// ],

	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	// testPathIgnorePatterns: [
	//   "/node_modules/"
	// ],

	// The regexp pattern or array of patterns that Jest uses to detect test files
	// testRegex: [],

	// This option allows the use of a custom results processor
	// testResultsProcessor: undefined,

	// This option allows use of a custom test runner
	// testRunner: "jest-circus/runner",

	// A map from regular expressions to paths to transformers
	// transform: undefined,

	// An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
	// transformIgnorePatterns: [
	//   "/node_modules/",
	//   "\\.pnp\\.[^\\/]+$"
	// ],

	// An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
	// unmockedModulePathPatterns: undefined,

	// Indicates whether each individual test should be reported during the run
	// verbose: undefined,

	// An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
	// watchPathIgnorePatterns: [],

	// Whether to use watchman for file crawling
	// watchman: true,
};

export default createJestConfig(config);

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/store/counterStore.ts`:

```ts
// You can modify this file as per your requirement

import { create } from 'zustand';

interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

// create a store with the initial state
// this will persist the state across the components
const useCounterStore = create<CounterState>((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
	reset: () => set(() => ({ count: 0 })),
}));

// use this hook in your component to access the store
// example
// const { count, increment, decrement, reset } = useCounterStore();
// count will have the current value of the count
// increment will increment the count by 1 -> increment() will increment the count by 1
// decrement will decrement the count by 1 -> decrement() will decrement the count by 1
// reset will reset the count to 0 -> reset() will reset the count to 0

export default useCounterStore;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/store/userStore.ts`:

```ts
import { create } from 'zustand';

interface UserState {
	username: string;
	email: string;
	age: number;
	setUser: () => void;
	setEmail: () => void;
	reset: () => void;
}

const useUserStore = create<UserState>((set) => ({
	username: '',
	email: '',
	age: 0,
	setUser: () => set((state) => ({ username: state.username, email: state.email })),
	setEmail: () => set((state) => ({ email: state.email })),
	reset: () => set(() => ({ username: '', email: '', age: 0 })),
}));

export default useUserStore;

```

`/Users/abhilasha/Documents/chatbots/code-gen-bot/cloned_repos/d3569045-683b-4ce1-b54a-0417341d73f3/virtual-stagging/store/index.ts`:

```ts
export { default as useCounterStore } from './counterStore';
export { default as useUserStore } from './userStore';

```