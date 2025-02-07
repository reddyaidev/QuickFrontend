import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/logo";
import OrderForm from "@/components/order-form";
import ProfileForm from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => auth.signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="order" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="order">Create Order</TabsTrigger>
            <TabsTrigger value="bids">Manage Bids</TabsTrigger>
            <TabsTrigger value="track">Track Delivery</TabsTrigger>
            <TabsTrigger value="payments">Manage Payments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="order">
            <OrderForm />
          </TabsContent>

          <TabsContent value="bids">
            <div className="text-center text-muted-foreground">
              No bids available yet
            </div>
          </TabsContent>

          <TabsContent value="track">
            <div className="text-center text-muted-foreground">
              No active deliveries
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="text-center text-muted-foreground">
              No payment history
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
