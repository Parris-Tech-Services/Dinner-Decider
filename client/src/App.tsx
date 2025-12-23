import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import OptionsList from "@/pages/OptionsList";
import OptionForm from "@/pages/OptionForm";
import History from "@/pages/History";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/options" component={OptionsList} />
        <Route path="/options/new" component={OptionForm} />
        <Route path="/options/:id" component={OptionForm} />
        <Route path="/history" component={History} />
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
