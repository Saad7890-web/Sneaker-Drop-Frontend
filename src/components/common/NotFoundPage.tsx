import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-12">
      <Card className="w-full p-6">
        <h1 className="text-3xl font-semibold text-white">404</h1>
        <p className="mt-2 text-slate-400">
          The page you are looking for does not exist.
        </p>

        <div className="mt-6">
          <Link to="/">
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
