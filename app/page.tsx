"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <div className="relative mb-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="peer w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
          />
          <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-4 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-500 
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            className="peer w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
          />
          <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-4 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-500 
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
            Password
          </label>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-white 
          bg-gradient-to-r from-green-400 to-emerald-500 
          hover:scale-[1.02] active:scale-[0.98] 
          transition-all duration-200 shadow-lg hover:shadow-green-500/30 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Extra links */}
        <div className="text-center mt-5 text-sm text-gray-300">
        <p
  onClick={() => router.push("/reset")}
  className="cursor-pointer hover:text-blue-400"
>
  Forgot Password?
</p>

<p className="mt-2">
  Don’t have an account?{" "}
  <span
    onClick={() => router.push("/signup")}
    className="text-blue-400 cursor-pointer"
  >
    Sign Up
  </span>
</p>
        </div>
      </div>
    </div>
  );
}