"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
}

function isErrorWithMessage(error: unknown): error is Error {
  return error instanceof Error;
}

export function ImageUpload({
  value,
  onChange,
  className,
  placeholder,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side validation
    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 2MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Apenas JPEG, PNG ou WebP são permitidos");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro no upload da imagem");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (error: unknown) {
      console.error(error);
      setError(isErrorWithMessage(error) ? error.message : "Erro inesperado");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group rounded-md overflow-hidden border border-border h-24 w-24 bg-muted flex-shrink-0">
            <Image
              src={value}
              alt="Uploaded thumbnail"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-24 w-24 rounded-md border border-dashed border-muted-foreground/50 bg-muted/30 flex items-center justify-center text-muted-foreground/50 flex-shrink-0">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />

          <div className="flex flex-col gap-2 items-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {value ? "Trocar imagem" : placeholder || "Fazer upload"}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              JPEG, PNG ou WebP. Máximo de 2MB.
            </p>

            {error && (
              <p className="text-xs text-destructive animate-fade-in">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
