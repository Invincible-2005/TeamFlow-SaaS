"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
  systemTheme?: "light" | "dark"
  themes: Theme[]
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme
}

function applyTheme(theme: Theme, disableTransitionOnChange: boolean) {
  const root = document.documentElement
  const resolved = resolveTheme(theme)

  if (disableTransitionOnChange) {
    const style = document.createElement("style")
    style.appendChild(
      document.createTextNode(
        "*,*::before,*::after{transition:none!important}"
      )
    )
    document.head.appendChild(style)
    window.getComputedStyle(document.body)
    setTimeout(() => document.head.removeChild(style), 1)
  }

  root.classList.remove("light", "dark")
  root.classList.add(resolved)
  root.style.colorScheme = resolved

  return resolved
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light"
  )
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    const initial = stored ?? defaultTheme
    setThemeState(initial)
    setResolvedTheme(applyTheme(initial, false))
    setMounted(true)
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    if (!mounted) return
    setResolvedTheme(applyTheme(theme, disableTransitionOnChange))
    localStorage.setItem(storageKey, theme)
  }, [theme, mounted, storageKey, disableTransitionOnChange])

  React.useEffect(() => {
    if (!mounted || theme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      setResolvedTheme(applyTheme("system", disableTransitionOnChange))
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme, mounted, disableTransitionOnChange])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
  }, [])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme: getSystemTheme(),
      themes: ["light", "dark", "system"] as Theme[],
    }),
    [theme, setTheme, resolvedTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
