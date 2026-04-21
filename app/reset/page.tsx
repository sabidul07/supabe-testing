"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPage() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Reset link sent 📩");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-6 bg-white/10 rounded-xl space-y-4 w-80">
        <h2 className="text-white text-xl text-center">Reset Password 🔑</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 w-full rounded bg-gray-800 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="bg-blue-500 w-full p-3 rounded text-white"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
