"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginLinks = () => {
  const { user } = useAuth({ middleware: "guest" });
  const router = useRouter();
  useEffect(() => {
    if (user) {
      user?.role == 1 ? router.push("/dashboard") : router.push("/config");
    } else {
      router.push("/login");
    }
  }),
    [user];

  return (
    <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
      {user ? (
        <Link
          href="/dashboard"
          className="ml-4 text-sm text-gray-700 underline"
        >
          Painel
        </Link>
      ) : (
        <>
          <Link href="/login" className="text-sm text-gray-700 underline">
            Login
          </Link>

          <Link
            href="/register"
            className="ml-4 text-sm text-gray-700 underline"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default LoginLinks;
