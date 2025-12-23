import { TakeawayOption } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, ShoppingBag, Leaf, MilkOff, Info } from "lucide-react";

interface TakeawayCardProps {
  option: TakeawayOption;
  reasons?: string[];
  rank?: number;
  featured?: boolean;
}

export function TakeawayCard({ option, reasons, rank, featured }: TakeawayCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${featured ? 'border-primary/30 shadow-xl bg-gradient-to-br from-background to-orange-50/50' : 'hover:border-primary/20'}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            {rank && <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">#{rank} Pick</div>}
            <h3 className={`font-display font-bold leading-tight ${featured ? 'text-2xl text-primary' : 'text-lg text-foreground'}`}>
              {option.name}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {option.priceLevel}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {option.cuisineTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        {reasons && reasons.length > 0 && (
          <div className="mb-4 bg-primary/5 rounded-lg p-3">
            <p className="text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Why this pick?</p>
            <ul className="space-y-1">
              {reasons.map((r) => (
                <li key={r} className="text-sm flex items-center gap-2 text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <Truck className={`w-3.5 h-3.5 ${option.deliveryAvailable ? 'text-green-600' : 'text-gray-300'}`} />
            <span className={!option.deliveryAvailable ? 'line-through opacity-50' : ''}>Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShoppingBag className={`w-3.5 h-3.5 ${option.pickupAvailable ? 'text-green-600' : 'text-gray-300'}`} />
            <span className={!option.pickupAvailable ? 'line-through opacity-50' : ''}>Pickup</span>
          </div>
          {option.healthyScore >= 4 && (
            <div className="flex items-center gap-1.5 text-green-600 font-medium">
              <Leaf className="w-3.5 h-3.5" />
              <span>Healthy</span>
            </div>
          )}
          {option.dairyFreeFriendly === "Yes" && (
            <div className="flex items-center gap-1.5 text-blue-600 font-medium">
              <MilkOff className="w-3.5 h-3.5" />
              <span>Dairy-Free</span>
            </div>
          )}
        </div>
        
        {option.notes && featured && (
           <div className="mt-4 pt-3 border-t border-dashed border-border flex items-start gap-2 text-sm text-muted-foreground">
             <Info className="w-4 h-4 mt-0.5 shrink-0" />
             <p>{option.notes}</p>
           </div>
        )}
      </div>
    </Card>
  );
}
