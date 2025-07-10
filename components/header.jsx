import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
// import { Pacifico } from "next/font/google";
// const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
// import { Montserrat } from "next/font/google";
// const montserrat = Montserrat({ subsets: ["latin"], weight: "700" });
import { Orbitron } from "next/font/google";
const orbitron = Orbitron({ subsets: ["latin"], weight: "700" });

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6 px-12 border-b">
        <Link href="/" className={`${orbitron.className} text-2xl font-bold tracking-widest uppercase`}>
            <span className="text-blue-300">Apply</span>Track
        </Link>
        <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-300 transition-colors">
                Home
            </Link>
            <Link href="/dashboard" className="hover:text-blue-300 transition-colors">
                Dashboard
            </Link>
            <Link href="/companies" className="hover:text-blue-300 transition-colors">
                Companies
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                    <Button asChild variant="outline">
                    <Link href="/sign-in">Login</Link>
                    </Button>
                    <Button asChild>
                    <Link href="/sign-up">Get Started</Link>
                    </Button>
                </SignedOut>
            </div>
        </nav>
    </header>
  )
}

export default Header