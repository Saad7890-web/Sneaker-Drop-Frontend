import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { login } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values);
      setSession(result.user, result.accessToken);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      const err = error as ApiError;
      if (err.code === "INVALID_CREDENTIALS") {
        setError("password", { message: "Invalid email or password" });
      } else {
        toast.error(err.message || "Login failed");
      }
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <Card className="w-full p-6">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400">
            Sign in to reserve and purchase drops in real time.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          No account yet?{" "}
          <Link className="text-blue-400 hover:text-blue-300" to="/register">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
}
