"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { useMutateBootstrap } from "@/components/hooks";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SelectField,
  TextField,
} from "@/components/ui";
import { toast } from "@/components/ui/common/toast";
import { getAppRoute } from "@/configs/app-routes";
import {
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "@/lib/user-profile";

type InitialSetupValues = {
  name: string;
  email: string;
  password: string;
  preferredCurrency: SupportedCurrency;
};

export function InitialSetupForm() {
  const router = useRouter();
  const bootstrapMutation = useMutateBootstrap();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<InitialSetupValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      preferredCurrency: "USD",
    },
  });

  async function onSubmit(data: InitialSetupValues) {
    clearErrors("root");
    try {
      await bootstrapMutation.mutateAsync(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not complete setup";
      toast.error(message);
      return;
    }
    toast.success("Administrator account ready");
    router.push(getAppRoute("dashboard"));
    router.refresh();
  }

  return (
    <Card className="border-border/60 bg-muted/80 shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome to Fintrack
        </CardTitle>
        <CardDescription>
          Create the first administrator account for this installation. This
          page is only available while no users exist.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <TextField
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          <Controller
            control={control}
            name="preferredCurrency"
            rules={{ required: "Preferred currency is required" }}
            render={({ field }) => (
              <SelectField
                label="Preferred currency"
                value={field.value}
                onValueChange={field.onChange}
                options={SUPPORTED_CURRENCIES.map((currency) => ({
                  value: currency,
                  label: currency,
                }))}
                error={errors.preferredCurrency?.message}
              />
            )}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting || bootstrapMutation.isPending}
          >
            {isSubmitting || bootstrapMutation.isPending
              ? "Creating account…"
              : "Create administrator"}
          </Button>
          <p className="text-center text-sm text-subtext-1 sm:text-right">
            <Link
              href={getAppRoute("home")}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to home
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
