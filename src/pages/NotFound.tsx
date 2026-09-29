import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="panel w-full max-w-lg p-8 font-mono text-sm">
        <div className="text-danger">HTTP/2 404 Not Found</div>
        <pre className="mt-4 whitespace-pre-wrap text-muted">
{`{
  "error": "route_not_found",
  "path": "${typeof window !== "undefined" ? window.location.pathname : ""}",
  "hint": "try GET /"
}`}
        </pre>
        <Link to="/" className="btn-ghost mt-6">
          ← back home
        </Link>
      </div>
    </main>
  );
}
