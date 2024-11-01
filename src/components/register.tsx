"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { T, useTranslate } from "@tolgee/react";

export const Register = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { t } = useTranslate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/login");
      router.refresh();
    } else {
      toast({
        title: t("something-went-wrong"),
        description: t("there-was-a-problem-registering-your-account"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          <T keyName="register" />
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              name="email"
              placeholder={t("email")}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <Input
              type="password"
              name="password"
              placeholder={t("password")}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
          >
            <T keyName="register" />
          </Button>

          <p className="text-center mt-4">
            <T keyName="already-have-an-account" />{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-600 transition duration-200"
            >
              <T keyName="login" />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
