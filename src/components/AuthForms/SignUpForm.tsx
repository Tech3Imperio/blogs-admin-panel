"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Input } from "@/components/ui/input";
import { signup } from "@/app/actions/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendOTP, verifyOTP } from "@/app/actions/email";

const allowedDomains = ["@selectivesystems.in", "@imperiorailing.com"];

const SignUpFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .refine(
        (email) => allowedDomains.some((domain) => email.endsWith(domain)),
        {
          message: "Invalid Email",
        }
      ),
    password: z
      .string()
      .min(8, { message: "Password must contain atleast 8 characters" })
      .max(20, { message: "Password must not be more that 20 characters" }),
    confirmPassword: z
      .string({ required_error: "Required" })
      .min(8, { message: "Password must contain atleast 8 characters" })
      .max(20, { message: "Password must not be more that 20 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // This targets confirmPassword field
    message: "Passwords do not match",
  });

const OTPSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type RegistrationDetails = z.infer<typeof SignUpFormSchema>;
export type OTPDetails = z.infer<typeof OTPSchema>;

export default function SignUpForm({
  changePosition,
}: {
  changePosition: () => void;
}) {
  const { toast } = useToast();
  const [OTPValue, setOTPValue] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [registrationDetails, setRegistrationDetails] = useState<z.infer<
    typeof SignUpFormSchema
  > | null>(null);
  const SignUpform = useForm<RegistrationDetails>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const OTPForm = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSignUp(values: z.infer<typeof SignUpFormSchema>) {
    if (values.password === values.confirmPassword) {
      const status = await sendOTP(values);
      if (status) {
        toast({
          duration: 3000,
          title: `OTP Sent`,
          description: (
            <pre>
              <code>OTP sent on {values.email}</code>
            </pre>
          ),
        });
        setIsOTP(true);
        setRegistrationDetails({ ...values });
        SignUpform.reset();
      } else {
        console.log("Some error");
      }
    } else {
      await SignUpform.trigger("confirmPassword");
    }
  }

  async function onOTPSubmit() {
    console.log("In OTP Submit");
    const data = { pin: OTPValue };
    if (registrationDetails !== undefined) {
      console.log("This is data", data.pin);
      const status = await verifyOTP(data);
      if (status) {
        const userData = {
          email: registrationDetails!.email,
          password: registrationDetails!.password,
        };
        toast({
          duration: 1000,
          title: "Registration Successful",
        });
        await signup(userData);
      }
    } else {
      console.log("Error in User Details, it is", registrationDetails);
    }

    toast({
      duration: 3000,
      title: "Incorrect OTP",
    });
  }

  return (
    <>
      {isOTP ? (
        <Form {...OTPForm}>
          <form className="space-y-3 items-center flex flex-col">
            <h1 className="mb-4 text-3xl">Verify OTP</h1>
            <FormField
              control={OTPForm.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={OTPValue}
                      onChange={(value) => {
                        field.onChange(value);
                        setOTPValue(value);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="cursor-pointer">
                    Resend OTP
                  </FormDescription>
                  <div className="min-h-4 px-1">
                    <FormMessage className="text-[12px]" />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex flex-row h-min w-min gap-4 justify-center">
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    onOTPSubmit();
                  }}
                >
                  Verify
                  <LogIn />
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    changePosition();
                    setIsOTP(false);
                    setRegistrationDetails(null);
                    OTPForm.reset();
                  }}
                >
                  Sign In
                  <ChevronRight />
                </Button>
              </>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...SignUpform}>
          <form
            onSubmit={SignUpform.handleSubmit(onSignUp)}
            className="space-y-3 items-center flex flex-col"
          >
            <h1 className="mb-4 text-3xl">Sign Up</h1>
            <FormField
              control={SignUpform.control}
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
              control={SignUpform.control}
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
            <FormField
              control={SignUpform.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
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
                <Button>
                  Sign Up
                  <LogIn />
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    changePosition();
                    SignUpform.reset();
                  }}
                >
                  Sign In
                  <ChevronRight />
                </Button>
              </>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
