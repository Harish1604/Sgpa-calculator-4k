import { SGPACalculator } from "@/components/sgpa-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">SGPA Calculator</h1>
            <p className="text-muted-foreground text-lg">Easily calculate your semester grade point average</p>
          </header>
          <SGPACalculator />
        </div>
      </div>
    </main>
  )
}
