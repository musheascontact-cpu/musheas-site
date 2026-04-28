"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/lib/i18n-config";

export function LoginForm({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.ok) {
      router.push(`/${lang}/dashboard`);
      router.refresh();
    } else {
      setError(result?.error || "Login failed");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm border-0 bg-transparent shadow-none">
      <CardHeader className="text-center lg:text-left rtl:lg:text-right">
        <CardTitle className="text-3xl font-headline text-primary">{dictionary.login_page_title}</CardTitle>
        <CardDescription>
          {dictionary.login_description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{dictionary.login_email_label}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={dictionary.login_email_placeholder}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{dictionary.login_password_label}</Label>
              <Link href="#" className="ms-auto inline-block text-sm underline">
                {dictionary.login_forgot_password}
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && (
            <div className="text-sm text-destructive font-medium text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {dictionary.login_button}
          </Button>
          <Button variant="outline" className="w-full" size="lg" type="button" onClick={() => signIn('google')}>
            {dictionary.login_with_google}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {dictionary.login_signup_prompt}{" "}
          <Link href={`/${lang}/signup`} className="underline">
            {dictionary.login_signup_link}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
