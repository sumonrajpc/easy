"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { loginAction, type AuthState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

export default function LoginPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(loginAction, null);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60">
        <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Welcome Back</h1>
        <p className="mb-6 text-sm text-slate-500">Login to continue learning at EasySkillBD</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
              <Mail size={16} className="text-slate-400" />
              <input name="email" type="email" required placeholder="you@example.com" className="w-full text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
              <Lock size={16} className="text-slate-400" />
              <input name="password" type="password" required placeholder="••••••••" className="w-full text-sm outline-none" />
            </div>
          </div>

          <FormMessage state={state} />

          <SubmitButton className="gradient-brand w-full rounded-xl py-3 font-bold text-white shadow-lg">
            Login
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-600">
            Create one
          </Link>
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          <p className="mb-1 font-bold text-slate-600">Demo accounts (password: password123)</p>
          <p>Admin: admin@easyskillbd.com</p>
          <p>Instructor: instructor@easyskillbd.com</p>
          <p>Student: student@easyskillbd.com</p>
        </div>
      </div>
    </div>
  );
}
