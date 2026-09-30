import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="page flex min-h-screen flex-col justify-center py-16">
      <p className="meta">404</p>
      <h1 className="mt-2 text-4xl font-medium">This page doesn't exist.</h1>
      <p className="mt-4 max-w-md text-muted">The link may be old, or the address has a typo.</p>
      <p className="mt-8">
        <Link to="/" className="btn-plain">
          Go to the portfolio
        </Link>
      </p>
    </main>
  );
}
