import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              🚗
            </div>
            <h1 className="text-xl font-bold text-primary">FreeRide</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth" className="text-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Share Your <span className="text-primary">Ride</span>, Save Your <span className="text-accent">Money</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect with drivers and riders in your area. Split costs, reduce traffic, and make new friends on your commute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth?role=driver">
                <Button size="lg" className="w-full sm:w-auto">
                  I'm a Driver
                </Button>
              </Link>
              <Link href="/auth?role=rider">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  I'm a Rider
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-primary/5 border-primary/20 col-span-2 md:col-span-1">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="font-semibold mb-2">For Drivers</h3>
              <p className="text-sm text-muted-foreground">Earn money while driving and reduce fuel costs</p>
            </Card>
            <Card className="p-6 bg-accent/5 border-accent/20 col-span-2 md:col-span-1">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold mb-2">For Riders</h3>
              <p className="text-sm text-muted-foreground">Get convenient rides at affordable prices</p>
            </Card>
            <Card className="p-6 bg-secondary/5 border-secondary/20 col-span-2 md:col-span-1">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold mb-2">Local Routes</h3>
              <p className="text-sm text-muted-foreground">Find rides on your regular commute path</p>
            </Card>
            <Card className="p-6 bg-primary/5 border-primary/20 col-span-2 md:col-span-1">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold mb-2">Safe & Secure</h3>
              <p className="text-sm text-muted-foreground">Verified profiles and real-time tracking</p>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 pt-16 border-t border-border">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FreeRide?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="font-semibold text-lg">Easy Booking</h3>
              <p className="text-muted-foreground">Book a ride in seconds with our simple interface</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="font-semibold text-lg">Save Money</h3>
              <p className="text-muted-foreground">Share costs and split the commute expenses</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="font-semibold text-lg">Real-time Updates</h3>
              <p className="text-muted-foreground">Get instant notifications on ride matches and locations</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 FreeRide. Made for sustainable commuting.</p>
        </div>
      </footer>
    </div>
  )
}
