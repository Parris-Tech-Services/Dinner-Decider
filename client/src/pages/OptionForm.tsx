import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useRoute } from "wouter";
import { useTakeawayOptions, useTakeawayOption } from "@/hooks/use-takeaway";
import { cuisineTypes, priceLevels, fatCautionLevels, type TakeawayOption } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cuisineTags: z.array(z.string()).min(1, "Select at least one cuisine"),
  priceLevel: z.enum(["$", "$$", "$$$"]),
  kidFriendlyScore: z.coerce.number().min(1).max(5),
  dairyFreeFriendly: z.enum(["Yes", "No", "Notes"]),
  healthyScore: z.coerce.number().min(1).max(5),
  fatCaution: z.enum(["Low", "Med", "High"]),
  deliveryAvailable: z.boolean(),
  pickupAvailable: z.boolean(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function OptionForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/options/:id");
  const isEdit = match && params?.id !== "new";
  const { addOption, updateOption, deleteOption } = useTakeawayOptions();
  const { option, isLoading } = useTakeawayOption(isEdit ? Number(params!.id) : 0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cuisineTags: [],
      priceLevel: "$$",
      kidFriendlyScore: 3,
      dairyFreeFriendly: "No",
      healthyScore: 3,
      fatCaution: "Med",
      deliveryAvailable: true,
      pickupAvailable: true,
      notes: ""
    }
  });

  useEffect(() => {
    if (option) {
      form.reset({
        name: option.name,
        cuisineTags: option.cuisineTags,
        priceLevel: option.priceLevel,
        kidFriendlyScore: option.kidFriendlyScore,
        dairyFreeFriendly: option.dairyFreeFriendly,
        healthyScore: option.healthyScore,
        fatCaution: option.fatCaution,
        deliveryAvailable: option.deliveryAvailable,
        pickupAvailable: option.pickupAvailable,
        notes: option.notes || ""
      });
    }
  }, [option, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit) {
        await updateOption(Number(params!.id), data);
        toast({ title: "Updated!", description: "Changes saved successfully." });
      } else {
        await addOption(data);
        toast({ title: "Created!", description: "New place added to your list." });
      }
      setLocation("/options");
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this place?")) {
      await deleteOption(Number(params!.id));
      setLocation("/options");
    }
  };

  if (isEdit && isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" className="-ml-2" onClick={() => setLocation("/options")}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-lg font-display font-bold">{isEdit ? "Edit Place" : "New Place"}</h1>
          <div className="w-16 flex justify-end">
            {isEdit && (
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Place Name</Label>
              <Input id="name" {...form.register("name")} placeholder="e.g. Joe's Pizza" className="text-lg font-semibold" />
              {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Cuisine</Label>
              <div className="flex flex-wrap gap-2">
                {cuisineTypes.map((type) => {
                  const current = form.watch("cuisineTags");
                  const isSelected = current.includes(type);
                  return (
                    <Badge 
                      key={type}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer hover:opacity-80 px-3 py-1"
                      onClick={() => {
                        const newTags = isSelected 
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        form.setValue("cuisineTags", newTags, { shouldValidate: true });
                      }}
                    >
                      {type}
                    </Badge>
                  );
                })}
              </div>
              {form.formState.errors.cuisineTags && <p className="text-red-500 text-xs">{form.formState.errors.cuisineTags.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price Level</Label>
                <Controller
                  control={form.control}
                  name="priceLevel"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceLevels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Dairy Free?</Label>
                <Controller
                  control={form.control}
                  name="dairyFreeFriendly"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes (Friendly)</SelectItem>
                        <SelectItem value="No">No (Unsafe)</SelectItem>
                        <SelectItem value="Notes">See Notes</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Kid Friendly Score (1-5)</Label>
                  <span className="text-sm font-bold text-primary">{form.watch("kidFriendlyScore")}</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="1"
                  className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  {...form.register("kidFriendlyScore")} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Healthy-ish Score (1-5)</Label>
                  <span className="text-sm font-bold text-primary">{form.watch("healthyScore")}</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="1"
                  className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  {...form.register("healthyScore")} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center justify-between p-3 border rounded-xl">
                <Label className="cursor-pointer" htmlFor="delivery">Delivery</Label>
                <Controller
                  control={form.control}
                  name="deliveryAvailable"
                  render={({ field }) => (
                    <Switch id="delivery" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-xl">
                <Label className="cursor-pointer" htmlFor="pickup">Pickup</Label>
                <Controller
                  control={form.control}
                  name="pickupAvailable"
                  render={({ field }) => (
                    <Switch id="pickup" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea 
                id="notes" 
                className="w-full min-h-[100px] rounded-xl border-2 border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="What to order, special instructions..."
                {...form.register("notes")}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            {isEdit ? "Save Changes" : "Create Place"}
          </Button>
        </form>
      </main>
    </div>
  );
}
