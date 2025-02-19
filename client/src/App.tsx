import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/not-found";
import { auth } from "./lib/firebase";
import { useEffect, useState } from "react";
import { clearAllFormData } from "./lib/form-utils";

function Router() {
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const previousUser = auth.currentUser;
      setUser(user);
      setIsLoading(false);
      
      // Clear form data when user logs out
      if (previousUser && !user) {
        clearAllFormData();
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/" component={user ? Dashboard : LandingPage} />
      <Route path="/dashboard">
        {user ? <Dashboard /> : <LandingPage />}
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