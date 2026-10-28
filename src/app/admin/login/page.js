import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/server/auth";

export const metadata = { title: "Sign in" };

async function Login({ searchParams }) {
  if (await getAdmin()) redirect("/admin");
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : ""} />;
}

export default function LoginPage({ searchParams }) {
  return (
    <div className="grid min-h-svh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src="/images/brand/logo.webp" alt="Eastern Cambridge School" width={1200} height={280} preload className="mx-auto h-12 w-auto" />
          <h1 className="mt-8 font-serif text-3xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink/60">Manage the committee, faculty, fees, student strength and gallery.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_var(--line)] sm:p-8">
          <Suspense fallback={<div className="h-64" />}>
            <Login searchParams={searchParams} />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-ink/55 hover:text-ink">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
