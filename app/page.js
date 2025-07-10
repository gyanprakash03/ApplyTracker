import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut} from "@clerk/nextjs";
import { Bell, ClipboardList, HandCoins, Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Hero Section */}
      <main className="flex-1 flex flex-row items-center justify-center text-left p-6">
        <div className="max-w-2xl space-y-6 pl-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Track Your Job Applications <span className="text-primary">Smarter</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Organize applications, deadlines, and responses in one place.
          </p>

          <div className="pt-4">
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </SignedIn>
          </div>

          <div className="flex gap-14 pt-4">
            <div className="flex flex-row items-center gap-1">
              <Lightbulb className="w-6 text-accent-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Insights</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Bell className="w-6 text-accent-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Reminders</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <ClipboardList className="w-6 text-accent-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Tracking</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <HandCoins className="w-6 text-accent-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Opportunities</span>
            </div>
          </div>
        </div>
        

        <div className="mt-16 text-muted-foreground">
          <Image
            src="/hero-section.png"
            alt="Job Application Tracker"
            width={500}
            height={300}
            className="mx-auto"
          />
        </div>
      </main>
    </div>
  );
}