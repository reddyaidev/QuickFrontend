import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/logo";
import { loginWithGoogle } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { UserIcon } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const loginForm = useForm();
  const signupForm = useForm();

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Logo />
        <Button variant="secondary">Service Provider</Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <Button 
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full mb-4 bg-[#FFC107] text-black hover:bg-[#FFA000]"
            >
              <UserIcon className="mr-2 h-5 w-5" />
              {isLoading ? "Logging in..." : "Continue as Guest"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or log in with email
                </span>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form className="space-y-4">
                    <FormField
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="password" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-[#FFC107] text-black hover:bg-[#FFA000]">
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form className="space-y-4">
                    <FormField
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-[#FFC107] text-black hover:bg-[#FFA000]">
                      Sign Up
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              disabled
              className="w-full bg-blue-600 hover:bg-blue-700 opacity-50 cursor-not-allowed"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}