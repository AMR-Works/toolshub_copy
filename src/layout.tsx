import { ThemeProvider } from "@/components/ThemeProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <header className="flex items-center justify-between p-0">
              <h1 className="text-2xl font-bold">Galaxy Flow</h1>
              <ThemeToggle />
            </header>
            <main className="container mx-auto py-0">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
