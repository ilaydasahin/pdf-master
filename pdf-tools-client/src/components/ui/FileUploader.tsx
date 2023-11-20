"use client"

import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { Upload, File, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

interface FileUploaderProps extends DropzoneOptions {
  className?: string
  onFilesSelected: (files: File[]) => void
}

export function FileUploader({
  className,
  onFilesSelected,
  ...props
}: FileUploaderProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles)
    },
    [onFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    ...props,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center transition-all hover:border-brand hover:bg-red-50/50",
        isDragActive && "border-brand bg-red-50/50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-110">
        <Upload className="h-8 w-8 text-brand" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Select PDF files
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        or drop PDFs here
      </p>
      <Button size="lg" className="pointer-events-none">
        Select PDF files
      </Button>
    </div>
  )
}
