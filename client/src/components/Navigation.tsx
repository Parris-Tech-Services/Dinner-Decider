import { Link, useLocation } from "wouter";
import { Home, List, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Decide", icon: Home },
    { href: "/options", label: "Places", icon: List },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-lg z-50 pb-safe">
      <div className="flex justify-around items-center max-w-md mx-auto h-16 px-4">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-16 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
