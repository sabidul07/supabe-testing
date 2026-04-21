"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 MAIN HANDLER
  const handleAuth = async () => {
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) alert(error.message);
      else alert("Signup successful! Check email ✅");
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else alert("Login successful 🚀");
    }

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/update-password",
      });
      if (error) alert(error.message);
      else alert("Reset link sent 📩");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 space-y-5">

        <h2 className="text-white text-2xl font-bold text-center">
          {mode === "login" && "Welcome Back 👋"}
          {mode === "signup" && "Create Account 🚀"}
          {mode === "reset" && "Reset Password 🔑"}
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-white/20 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password (not for reset) */}
        {mode !== "reset" && (
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white/20 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <button
          onClick={handleAuth}
          className="w-full bg-green-500 p-3 rounded text-white font-semibold"
        >
          {loading ? "Please wait..." : mode.toUpperCase()}
        </button>

        {/* Switch links */}
        <div className="text-sm text-center text-gray-300 space-y-2">
          {mode !== "login" && (
            <p onClick={() => setMode("login")} className="cursor-pointer text-blue-400">
              Back to Login
            </p>
          )}

          {mode === "login" && (
            <>
              <p onClick={() => setMode("signup")} className="cursor-pointer text-blue-400">
                Create Account
              </p>
              <p onClick={() => setMode("reset")} className="cursor-pointer text-red-400">
                Forgot Password?
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}