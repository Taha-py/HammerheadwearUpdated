import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="mx-auto h-20 w-20 rounded-2xl animate-float" />
      <h1 className="font-display text-4xl font-bold mt-6">Page not found</h1>
      <p className="text-sm text-black/55 mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}
