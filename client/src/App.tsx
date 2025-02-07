import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/not-found";
import { auth } from "./lib/firebase";
import { useEffect, useState } from "react";

function Router() {
  const [user, setUser] = useState(auth.currentUser);
  
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Switch>
      <Route path="/" component={user ? Dashboard : LandingPage} />
      <Route path="/dashboard" component={Dashboard}>
        {!user && window.location.replace("/")}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
