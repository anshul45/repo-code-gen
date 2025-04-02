"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ErrorDisplay() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    if (!error) return null

    return (
        <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
        </Alert>
    )
}
