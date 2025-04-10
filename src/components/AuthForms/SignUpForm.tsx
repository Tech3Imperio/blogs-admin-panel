"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronRight, Eye, EyeOff, LogIn } from "lucide-react";
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
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [OTPValue, setOTPValue] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
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
      setLoading(true);
      const status = await sendOTP(values);
      setLoading(false);
      if (status) {
        toast({
          duration: 2000,
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
    setLoading(true);
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
          duration: 2000,
          title: "Registration Successful",
        });
        await signup(userData);
      }
    } else {
      console.log("Error in User Details, it is", registrationDetails);
    }

    toast({
      duration: 2000,
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
                  {loading ? (
                    <div
                      className={`h-[14px] w-[14px] border-2 ${
                        theme === "light" ? "border-white" : "border-black"
                      } border-t-transparent rounded-full animate-spin`}
                    ></div>
                  ) : (
                    <LogIn />
                  )}
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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
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
                    <div className="relative w-full h-max">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="min-w-72"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                <Button>
                  Sign Up
                  {loading ? (
                    <div className="h-[14px] w-[14px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <LogIn />
                  )}
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
