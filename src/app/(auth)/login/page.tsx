import type { Metadata } from "next";
import { LoginForm } from "@/domains/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return <LoginForm />;
}