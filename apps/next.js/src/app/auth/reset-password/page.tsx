"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// We need to use the service role key to have the admin role for the supabase client
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);
export default function ResetPasswordPage() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Get the access token and refresh token from the URL
    if (typeof window !== "undefined") {
      console.log("window.location.hash", window.location.hash);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      setAccessToken(hashParams.get("access_token") || "");
      setRefreshToken(hashParams.get("refresh_token") || "");
    }
  }, []);

  useEffect(() => {
    // Authenticate the user using the access token and refresh token
    const getSessionWithTokens = async () => {
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          alert(`Error signing in: ${error.message}`);
        }
      }
    };

    // Call this function only when accessToken and refreshToken are available.
    if (accessToken && refreshToken) {
      getSessionWithTokens();
    }
  }, [accessToken, refreshToken]);

  const handlePasswordUpdate = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      if (data) {
        alert("Password has been updated successfully!");
      }
    } catch (error: unknown) {
      // @ts-expect-error - error is unknown type
      alert(`Error updating password: ${error.message}`);
    }
  };

  const handleSubmit = (e: unknown) => {
    // @ts-expect-error - e.preventDefault is not defined in HTMLFormElement type
    e.preventDefault();
    handlePasswordUpdate(password);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg"
      >
        <div className="flex justify-center">
          <Image
            src="/icon/ecoffice-big.png"
            alt="Ecoffice Logo"
            width={250}
            height={250}
          />
        </div>
        <h2 className="mt-6 text-center text-lg font-normal text-gray-900">
          Cambia la tua password
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="user@example.com"
              className="bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between"></div>
          <Button className="w-full rounded-xl bg-background" type="submit">
            Cambia la password
          </Button>
        </div>
      </form>
    </div>
  );
}
