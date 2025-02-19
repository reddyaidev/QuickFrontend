import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { auth } from "@/lib/firebase";
import { CheckCircle2 } from "lucide-react";

export default function ProfileForm() {
  const user = auth.currentUser;
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Email verified: {user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Phone verified: {user?.phoneNumber}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <Form {...form}>
              <form className="space-y-4">
                <div className="space-y-6">
                  <FloatingLabelInput
                    label="Current Password"
                    type="password"
                    {...form.register("currentPassword")}
                  />
                  <FloatingLabelInput
                    label="New Password"
                    type="password"
                    {...form.register("newPassword")}
                  />
                  <FloatingLabelInput
                    label="Confirm New Password"
                    type="password"
                    {...form.register("confirmPassword")}
                  />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </Form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            <div className="text-center text-muted-foreground py-8">
              No orders yet
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
