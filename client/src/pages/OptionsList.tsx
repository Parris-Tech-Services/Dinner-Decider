import { useState } from "react";
import { useTakeawayOptions, useTakeawayOption } from "@/hooks/use-takeaway";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TakeawayCard } from "@/components/TakeawayCard";
import { Plus, Search, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function OptionsList() {
  const { options, isLoading } = useTakeawayOptions();
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase()) || 
    opt.cuisineTags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold">My Places</h1>
          <Button size="sm" onClick={() => setLocation("/options/new")}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        <div className="px-4 pb-4 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search places..." 
              className="pl-9 bg-muted/50 border-none focus:bg-background transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto space-y-4">
        {isLoading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />)}
          </div>
        ) : filteredOptions.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredOptions.map((opt) => (
              <Link key={opt.id} href={`/options/${opt.id}`} className="block">
                <TakeawayCard option={opt} />
              </Link>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No places found matching "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
