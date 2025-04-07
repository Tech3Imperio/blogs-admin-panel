"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, Eye, EyeOff, LogIn } from "lucide-react";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const allowedDomains = ["@selectivesystems.in", "@imperiorailing.com"];

const SignInFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .refine(
      (email) => allowedDomains.some((domain) => email.endsWith(domain)),
      { message: "Invalid Email" }
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSignIn(values: z.infer<typeof SignInFormSchema>) {
    setLoading(true);
    const status = await signin(values);
    toast({
      duration: 2000,
      title: `${status.message}`,
    });
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
                <div className="relative w-full h-max">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="min-w-72"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
              {loading ? (
                <div className="h-[14px] w-[14px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogIn />
              )}
            </Button>
          </>
        </div>
      </form>
    </Form>
  );
}
