"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signup, signin } from "@/app/actions/auth";

const allowedDomains = ["@selectivesystems.in"];

const AuthFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .refine(
      (email) => allowedDomains.some((domain) => email.endsWith(domain)),
      { message: `Only emails from ${allowedDomains.join(" or ")} are allowed` }
    ),
  password: z
    .string()
    .min(8, { message: "Password must contain atleast 8 characters" })
    .max(20, { message: "Password must not be more that 20 characters" }),
});

async function onSignUp(values: z.infer<typeof AuthFormSchema>) {
  await signup(values);
}

async function onSignIn(values: z.infer<typeof AuthFormSchema>) {
  console.log("Clicked on signin", values);
  await signin(values);
}

export default function AuthForm() {
  const [isSignInActive, setIsSignInActive] = useState(true);

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(isSignInActive ? onSignIn : onSignUp)}
        className="space-y-3 items-center flex flex-col"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  className="min-w-72"
                  {...field}
                />
              </FormControl>
              <div className="min-h-4 px-1">
                <FormMessage className="text-[12px]" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  className="min-w-72"
                  {...field}
                />
              </FormControl>
              <div className="min-h-4  px-1">
                <FormMessage className="text-[12px]" />
              </div>
            </FormItem>
          )}
        />
        <div className="flex flex-row h-min w-min gap-4 justify-center">
          {isSignInActive ? (
            <>
              <Button>
                Sign In
                <LogIn />
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignInActive(false);
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignInActive(true);
                }}
              >
                Sign In
              </Button>
              <Button>
                Sign Up
                <LogIn />
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
