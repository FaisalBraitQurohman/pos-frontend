"use client"

import { useState, useCallback } from "react"

interface Toast {
    title: string
    description?: string
    variant?: "default" | "destructive"
}

export function useToast() {
    const toast = useCallback((props: Toast) => {
        // Simple alert-based toast for now
        const message = props.description
            ? `${props.title}\n${props.description}`
            : props.title

        if (props.variant === "destructive") {
            alert(`❌ ${message}`)
        } else {
            alert(`✅ ${message}`)
        }
    }, [])

    return { toast }
}
