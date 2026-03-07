import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useCreateCheckoutSessionMutation } from "../features/api/purchaseApi";

const BuyCourseButton = ({ courseId }) => {
  const [
    createCheckoutSession,
    { data, isLoading, isSuccess, isError, error },
  ] = useCreateCheckoutSessionMutation();

  const createCheckoutHandler = async () => {
    try {
      await createCheckoutSession({ courseId });
    } catch (err) {
      console.error("Error creating checkout session:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe checkout URL
      } else {
        toast.error("Invalid response from server.");
      }
    }
    if (isError) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to create session");
    }
  }, [data, isSuccess, isError, error]);

  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={createCheckoutHandler}
        className="bg-purple-500 w-full text-white hover:bg-purple-600 transition-colors px-4 py-2 rounded-md cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            Please wait
          </>
        ) : (
          "Buy Course Now"
        )}
      </Button>
    </div>
  );
};

export default BuyCourseButton;
