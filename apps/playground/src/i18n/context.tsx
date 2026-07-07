import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { ko } from "./ko"
import { en } from "./en"

export type Locale = "ko" | "en"

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
  toggle: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const messages: Record<Locale, Record<string, string>> = { ko, en }

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ko")

  const t = useCallback((key: string) => messages[locale][key] ?? key, [locale])
  const toggle = useCallback(() => setLocale((prev) => (prev === "ko" ? "en" : "ko")), [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, toggle }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
