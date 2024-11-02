"use client";

import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { T, useTranslate } from "@tolgee/react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";

export const LogoutBtn = () => {
  const router = useRouter();
  const { t } = useTranslate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("ERROR:", error);
      toast({
        title: t("something-went-wrong"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className={buttonVariants({
        className:
          "text-gray-800 text-md px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-700 transition",
        variant: "secondary",
      })}
      disabled={isLoading}
    >
      {isLoading && (
        <LoaderCircle className="w-5 h-5 text-gray-300 animate-spin mr-2" />
      )}
      <T keyName="logout" />
    </Button>
  );
};
