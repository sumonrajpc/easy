"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, GraduationCap, Briefcase } from "lucide-react";
import { registerAction, type AuthState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

export default function RegisterPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(registerAction, null);
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60">
        <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Create Your Account</h1>
        <p className="mb-6 text-sm text-slate-500">Join thousands of learners across Bangladesh</p>

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 font-semibold transition ${
                role === "STUDENT" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500"
              }`}
            >
              <GraduationCap size={20} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("INSTRUCTOR")}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 font-semibold transition ${
                role === "INSTRUCTOR" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500"
              }`}
            >
              <Briefcase size={20} />
              Instructor
            </button>
          </div>
          <input type="hidden" name="role" value={role} />

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
              <User size={16} className="text-slate-400" />
              <input name="name" required placeholder="Your name" className="w-full text-sm outline-none" />
            </div>
          </div>
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
              <input name="password" type="password" required minLength={6} placeholder="At least 6 characters" className="w-full text-sm outline-none" />
            </div>
          </div>

          <FormMessage state={state} />

          <SubmitButton className="gradient-brand w-full rounded-xl py-3 font-bold text-white shadow-lg">
            Create Account
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
