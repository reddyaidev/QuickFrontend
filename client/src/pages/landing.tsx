import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/logo";
import { loginWithGoogle } from "@/lib/firebase";
import { useState } from "react";
import { Divider } from "@/components/ui/divider";
import { LoginForm, SignUpForm } from "@/components/auth/auth-forms";
import { GoogleAuthButton, GuestAuthButton } from "@/components/auth/social-auth-buttons";
import { toast } from "@/components/ui/use-toast";
import { COLORS } from "@/constants/theme";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login as guest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: any) => {
    try {
      // Implement login logic
      console.log("Login data:", data);
      toast({
        title: "Success",
        description: "Logged in successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please check your credentials.",
        variant: "destructive"
      });
    }
  };

  const handleSignUp = async (data: any) => {
    try {
      // Implement signup logic
      console.log("Signup data:", data);
      toast({
        title: "Success",
        description: "Account created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
      <header className="container mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Logo />
        <Button variant="secondary" className="w-full sm:w-auto">Service Provider</Button>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <Card className="max-w-[95%] sm:max-w-md mx-auto">
          <CardContent className="pt-6">
            <GoogleAuthButton 
              onClick={loginWithGoogle}
            //   disabled={true} Enable when Google auth is ready
            />

            <Divider text="Or continue with" />

            <GuestAuthButton 
              onClick={handleGuestLogin}
              isLoading={isLoading}
            />

            <Divider text="Or log in with email" />

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm onSubmit={handleLogin} />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm onSubmit={handleSignUp} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}