import { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { lightTheme, darkTheme } from "@/lib/theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{
        light: JSON.stringify(lightTheme),
        dark: JSON.stringify(darkTheme),
      }}
    >
      {mounted && children}
    </NextThemesProvider>
  )
}
