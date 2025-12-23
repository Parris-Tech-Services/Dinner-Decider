import { useTakeawayHistory } from "@/hooks/use-takeaway";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Calendar, Star } from "lucide-react";

export default function History() {
  const { history, isLoading } = useTakeawayHistory();

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 max-w-md mx-auto">
          <h1 className="text-2xl font-display font-bold">Past Dinners</h1>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto">
        {isLoading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse" />)}
          </div>
        ) : history.length > 0 ? (
          <div className="relative border-l-2 border-muted ml-3 space-y-8 py-2">
            {history.map((item) => (
              <div key={item.id} className="relative pl-6">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-primary" />
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    {format(new Date(item.date), "EEE, d MMM")}
                  </span>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-lg">{item.optionName}</span>
                      {item.rating && (
                         <div className="flex items-center text-yellow-500">
                           <Star className="w-4 h-4 fill-current" />
                           <span className="ml-1 font-bold text-sm">{item.rating}</span>
                         </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-muted mt-4">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No history yet.</p>
            <p className="text-sm">Lock in a dinner to see it here!</p>
          </div>
        )}
      </main>
    </div>
  );
}
