"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", { email, password });
      localStorage.setItem("token", data.token);
      router.replace("/search");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[80vh] flex justify-center items-center">
      <div className="max-w-md mx-auto">
        <div className="card p-6">
          <h1 className="text-2xl font-bold mb-4">Create your account</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <input className="input" type="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Password (min 6 chars)"
              value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
          <p className="text-white/60 text-sm mt-4">
            Have an account? <a className="underline" href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
