"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signin } from "@/app/actions/auth";

const allowedDomains = ["@selectivesystems.in", "@imperiorailing.com"];

const SignInFormSchema = z.object({
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

export default function SignInForm({
  changePosition,
}: {
  changePosition: () => void;
}) {
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSignIn(values: z.infer<typeof SignInFormSchema>) {
    await signin(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSignIn)}
        className="space-y-3 items-center flex flex-col"
      >
        <h1 className="mb-4 text-3xl">Sign In</h1>
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
          <>
            <Button
              variant="ghost"
              type="button"
              onClick={(e) => {
                e.preventDefault();

                changePosition();
                form.reset();
              }}
            >
              <ChevronLeft />
              Sign Up
            </Button>
            <Button>
              Sign In
              <LogIn />
            </Button>
          </>
        </div>
      </form>
    </Form>
  );
}
