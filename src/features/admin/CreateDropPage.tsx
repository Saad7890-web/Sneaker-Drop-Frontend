import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createDrop } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { queryClient } from "@/lib/queryClient";
import {
  createDropSchema,
  type CreateDropFormValues,
} from "@/lib/validators/drop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateDropPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateDropFormValues>({
    resolver: zodResolver(createDropSchema),
    defaultValues: {
      title: "",
      totalStock: 100,
      startsAt: new Date().toISOString().slice(0, 16),
      endsAt: "",
    },
  });

  const onSubmit = async (values: CreateDropFormValues) => {
    try {
      const startsAtIso = new Date(values.startsAt).toISOString();
      const endsAtIso = values.endsAt
        ? new Date(values.endsAt).toISOString()
        : null;

      await createDrop({
        title: values.title,
        totalStock: Number(values.totalStock),
        startsAt: startsAtIso,
        endsAt: endsAtIso,
      });

      await queryClient.invalidateQueries({ queryKey: ["drops", "active"] });
      toast.success("Drop created successfully");
      reset({
        title: "",
        totalStock: 100,
        startsAt: new Date().toISOString().slice(0, 16),
        endsAt: "",
      });
    } catch (error) {
      const err = error as ApiError;
      if (err.code === "VALIDATION_ERROR") {
        setError("title", { message: err.message });
      } else {
        toast.error(err.message || "Failed to create drop");
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Create merch drop</h1>
        <p className="mt-2 text-sm text-slate-400">
          Admin-only workflow for initializing a new high-demand drop.
        </p>
      </div>

      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Drop title"
            placeholder="Air Jordan 1 - 100 units"
            error={errors.title?.message}
            {...register("title")}
          />

          <Input
            label="Total stock"
            type="number"
            min="1"
            error={errors.totalStock?.message}
            {...register("totalStock")}
          />

          <Input
            label="Starts at"
            type="datetime-local"
            error={errors.startsAt?.message}
            {...register("startsAt")}
          />

          <Input
            label="Ends at (optional)"
            type="datetime-local"
            error={errors.endsAt?.message}
            {...register("endsAt")}
          />

          <Button className="w-full" loading={isSubmitting}>
            Create drop
          </Button>
        </form>
      </Card>
    </div>
  );
}
