"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { esewaTopup } from "@/actions/esewa/index";
import { useSession } from "next-auth/react";

export default function EsewaPayment() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!session) {
    return <div>Please login to proceed with the payment.</div>;
  }

  const handleEsewaPayment = async () => {
    setIsLoading(true);

    try {
      const response = await esewaTopup({
        userId: session.user.id,
        amount: 100,
      });

      if (response.success && response.data?.esewaConfig) {
        toast.success("eSewa payment initiated successfully");

        // Create and submit the form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.entries(response.data.esewaConfig).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error(
          response.error ||
            "Failed to initiate eSewa payment. Please try again."
        );
      }
    } catch (error) {
      console.error("eSewa payment initiation error:", error);
      toast.error("eSewa payment initiation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center relative">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>eSewa Payment</CardTitle>
          <CardDescription>
            Click the button below to pay with eSewa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleEsewaPayment}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Pay with eSewa"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
