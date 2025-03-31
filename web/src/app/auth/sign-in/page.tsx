"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AuthPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl: "/create" })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-4xl font-bold tracking-tight">Welcome to OpenGig</CardTitle>
                    <CardDescription className="text-base">Sign in to continue to your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        onClick={handleGoogleSignIn}
                        variant="outline"
                        className="w-full h-12 text-base font-medium border-2 hover:bg-muted/50 hover:border-primary/50 transition-all"
                    >
                        <div className="mr-2 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path
                                        fill="#4285F4"
                                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                                    />
                                </g>
                            </svg>
                        </div>
                        Sign in with Google
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        By signing in, you agree to our
                        <a href="/terms" className="font-medium text-primary hover:underline ml-1">
                            Terms of Service
                        </a>{" "}
                        and
                        <a href="/privacy" className="font-medium text-primary hover:underline ml-1">
                            Privacy Policy
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

