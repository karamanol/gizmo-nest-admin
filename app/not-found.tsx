import Link from "next/link";

export default async function NotFound() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-10">Not Found 🥹</h2>
      <p className="text-6xl mb-20">404</p>
      <p className="text-center">Could not find requested resource</p>
      <p className="text-center">
        Visit{" "}
        <Link href="/" className="text-teal-700">
          Main Page
        </Link>
      </p>
    </div>
  );
}
