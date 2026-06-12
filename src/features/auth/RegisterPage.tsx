import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { register as registerApi } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await registerApi(values);
      setSession(result.user, result.accessToken);
      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      const err = error as ApiError;
      if (err.code === "ACCOUNT_CREATION_FAILED") {
        setError("email", { message: "Username or email already exists" });
      } else {
        toast.error(err.message || "Registration failed");
      }
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <Card className="w-full p-6">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="text-sm text-slate-400">
            Join the drop flow and reserve stock when it opens.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button className="w-full" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:text-blue-300" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
