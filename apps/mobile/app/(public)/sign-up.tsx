import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { api } from "@/lib/api";
import { SignInHeader } from "./sign-in";
import { toast } from "@backpackapp-io/react-native-toast";

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Please enter at least 8 characters.")
      .max(64, "Please enter fewer than 64 characters.")
      .regex(
        /^(?=.*[a-z])/,
        "Your password must have at least one lowercase letter."
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Your password must have at least one uppercase letter."
      )
      .regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Your password must have at least one special character."
      ),
    confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp } = useSupabase();
  const addUser = api.user.addUser.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password);
      await addUser.mutateAsync({ email: data.email });
      await form.reset();
      await router.replace("/sign-in");
      toast.success(
        "Account creato con successo! Controlla la tua email per confermare l'account.",
        {
          styles: {
            view: {
              backgroundColor: "#00930F",
              borderRadius: 8,
            },
            indicator: {
              backgroundColor: "white",
            },
          },
        }
      );
    } catch (error: Error) {
      toast.error(error.message, {
        styles: {
          view: {
            backgroundColor: "#00930F",
            borderRadius: 8,
          },
          indicator: {
            backgroundColor: "white",
          },
        },
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <SignInHeader />
      <View className="flex-1 mt-[15%]">
        <Text className="self-center mb-5 font-semibold text-2xl">
          Benvenuto! Registrati adesso
        </Text>
        <Form {...form}>
          <View className="gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Password"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />

            <Muted className="text-center">
              Creando un account, accetti i nostri{" "}
              <Pressable className="underline">
                <Muted className="underline">Termini e Condizioni</Muted>
              </Pressable>{" "}
              e la nostra{" "}
              <Pressable className="underline">
                <Muted className="underline">Politica sulla Privacy</Muted>
              </Pressable>
              .
            </Muted>

            <Button
              size="lg"
              variant="default"
              onPress={form.handleSubmit(onSubmit)}
              className="bg-[#334493]"
            >
              {form.formState.isSubmitting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="font-bold">Accedi</Text>
              )}
            </Button>
          </View>
        </Form>
      </View>
      <View className="gap-y-4">
        <Muted
          className="text-center"
          onPress={() => {
            router.replace("/sign-in");
          }}
        >
          Hai già un account?{" "}
          <Muted className="text-foreground underline text-[#334493]">
            Accedi
          </Muted>
        </Muted>
      </View>
    </SafeAreaView>
  );
}
