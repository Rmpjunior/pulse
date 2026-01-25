"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Lock, Palette, Type, Square, Moon, Sun } from "lucide-react";
import {
  themePresets,
  fontOptions,
  buttonStyleOptions,
  type ThemeSettings,
  type ThemeColors,
} from "@/types/theme";

interface ThemeEditorProps {
  settings: ThemeSettings;
  onChange: (settings: ThemeSettings) => void;
  isPlusUser: boolean;
}

export function ThemeEditor({
  settings,
  onChange,
  isPlusUser,
}: ThemeEditorProps) {
  const t = useTranslations("editor.theme");
  const [showCustomColors, setShowCustomColors] = useState(false);

  const currentPreset = themePresets.find((p) => p.id === settings.presetId);

  const handlePresetChange = (presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (preset?.isPremium && !isPlusUser) return;

    onChange({
      ...settings,
      presetId,
      customColors: undefined,
    });
  };

  const handleCustomColorChange = (key: keyof ThemeColors, value: string) => {
    if (!isPlusUser) return;

    const baseColors = currentPreset?.colors || themePresets[0].colors;
    const newCustomColors = {
      ...baseColors,
      ...(settings.customColors || {}),
      [key]: value,
    };

    onChange({
      ...settings,
      customColors: newCustomColors,
    });
  };

  const handleFontChange = (font: ThemeSettings["font"]) => {
    onChange({ ...settings, font });
  };

  const handleButtonStyleChange = (
    buttonStyle: ThemeSettings["buttonStyle"],
  ) => {
    onChange({ ...settings, buttonStyle });
  };

  const handleDarkModeToggle = () => {
    onChange({ ...settings, darkMode: !settings.darkMode });
  };

  return (
    <div className="space-y-6">
      {/* Color Palettes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t("palette")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {themePresets.map((preset) => {
              const isSelected = settings.presetId === preset.id;
              const isLocked = preset.isPremium && !isPlusUser;

              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  disabled={isLocked}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {/* Color preview */}
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                  </div>

                  <span className="text-xs font-medium">{preset.name}</span>

                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  {isLocked && (
                    <div className="absolute top-1 right-1">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom colors (Plus only) */}
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => setShowCustomColors(!showCustomColors)}
              className={`flex items-center gap-2 text-sm ${
                isPlusUser
                  ? "text-primary hover:underline"
                  : "text-muted-foreground"
              }`}
              disabled={!isPlusUser}
            >
              <Palette className="h-4 w-4" />
              {t("customColors")}
              {!isPlusUser && <Lock className="h-3 w-3 ml-1" />}
            </button>

            {showCustomColors && isPlusUser && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {Object.entries(
                  settings.customColors || currentPreset?.colors || {},
                ).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-xs font-medium capitalize mb-1 block">
                      {key === "primary"
                        ? "Primária"
                        : key === "secondary"
                          ? "Secundária"
                          : key === "background"
                            ? "Fundo"
                            : key === "text"
                              ? "Texto"
                              : "Destaque"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) =>
                          handleCustomColorChange(
                            key as keyof ThemeColors,
                            e.target.value,
                          )
                        }
                        className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                      />
                      <Input
                        value={value}
                        onChange={(e) =>
                          handleCustomColorChange(
                            key as keyof ThemeColors,
                            e.target.value,
                          )
                        }
                        className="flex-1 font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Font Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-5 w-5" />
            {t("font")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() =>
                  handleFontChange(font.id as ThemeSettings["font"])
                }
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  settings.font === font.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className={`text-sm font-medium ${font.className}`}>
                  {font.name}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Button Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Square className="h-5 w-5" />
            {t("buttonStyle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {buttonStyleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() =>
                  handleButtonStyleChange(
                    style.id as ThemeSettings["buttonStyle"],
                  )
                }
                className={`flex-1 p-4 border-2 transition-all ${
                  settings.buttonStyle === style.id
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
                style={{ borderRadius: style.borderRadius }}
              >
                <div
                  className="w-full h-8 bg-primary/20"
                  style={{ borderRadius: style.borderRadius }}
                />
                <span className="text-xs mt-2 block">{style.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dark Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {settings.darkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            {t("darkMode")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={handleDarkModeToggle}
            className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all ${
              settings.darkMode
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="text-sm">
              {settings.darkMode ? "Modo escuro ativado" : "Modo claro ativado"}
            </span>
            <div
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.darkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
