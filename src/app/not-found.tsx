import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 gap-4 px-4">
      <p className="text-6xl font-bold text-gray-300">404</p>
      <h1 className="text-xl font-semibold text-gray-900">Page not found</h1>
      <p className="text-gray-500 text-sm text-center">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-4 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
