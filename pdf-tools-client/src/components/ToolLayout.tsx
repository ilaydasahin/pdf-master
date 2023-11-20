import * as React from "react"
import { Container } from "@/components/ui/Container"

interface ToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background py-12">
      <Container>
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {description}
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </Container>
    </div>
  )
}
