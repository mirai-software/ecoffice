"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const CheckUser = api.user.checkifUserisAdmin.useMutation();

  /* 
  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };
  */

  const handleSignIn = async () => {
    await CheckUser.mutateAsync({ email }).then(async (data) => {
      if (!data) {
        toast({
          variant: "destructive",
          title: "Login Fallito",
          description: "Non sei autorizzato ad accedere o l'utente non esiste",
        });
        return;
      } else {
        await supabase.auth
          .signInWithPassword({
            email,
            password,
          })
          .then(async (data) => {
            if (!data.data.session) {
              toast({
                variant: "destructive",
                title: "Login Fallito",
                description: "Controlla le credenziali e riprova",
              });
            } else {
              router.push("/dashboard");
            }
          });
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Utilizza il tuo account per accedere all'area riservata
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" onClick={handleSignIn}>
              Login
            </Button>

            <Button
              variant="outline"
              className="w-full border-yellow-400"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://www.ecofficesrl.it/wp-content/uploads/2024/05/img-gallery-ecoffice-chi-siamo-11.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
