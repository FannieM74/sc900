import Link from "next/link";

export default function BackLink() {
  return (
    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
      ← Home
    </Link>
  );
}
