"use client";

import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const LogoutBtn = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Button
      onClick={() => handleLogout()}
      className={buttonVariants({
        className:
          "text-gray-800 text-md px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-700 transition",
        variant: "secondary",
      })}
    >
      Logout
    </Button>
  );
};
