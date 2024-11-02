"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { T, useTranslate } from "@tolgee/react";
import { LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export const Login = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { t } = useTranslate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        toast({
          title: t("something-went-wrong"),
          variant: "destructive",
        });
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("ERROR:", error);
      toast({
        title: t("something-went-wrong"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          <T keyName="login" />
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="text-xs font-bold uppercase text-gray-500"
            >
              <T keyName="email" />
            </Label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-6">
            <Label
              htmlFor="password"
              className="text-xs font-bold uppercase text-gray-500"
            >
              <T keyName="password" />
            </Label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading && (
              <LoaderCircle className="w-5 h-5 text-gray-300 mr-2 animate-spin" />
            )}
            <T keyName="login" />
          </Button>

          <p className="text-center mt-4">
            <T keyName="dont-have-an-account" />{" "}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-600 transition duration-200"
            >
              <T keyName="register" />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
