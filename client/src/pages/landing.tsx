import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import { loginWithGoogle } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { UserIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Logo />
        <Button variant="secondary">Service Provider</Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 space-y-4">
            <Button 
              onClick={loginWithGoogle} 
              className="w-full bg-[#FFC107] text-black hover:bg-[#FFA000]"
            >
              <UserIcon className="mr-2 h-5 w-5" />
              Continue as Guest
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Google Sign In (Coming Soon)
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