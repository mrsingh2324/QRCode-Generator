import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-4">
        404 - Not Found
      </h1>
      <p className="text-muted-foreground mb-8">
        The link you are looking for does not exist or has been removed.
      </p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
