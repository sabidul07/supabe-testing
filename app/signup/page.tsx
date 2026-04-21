"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup success ✅ Check email");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-6 bg-white/10 rounded-xl space-y-4">
        <h2 className="text-white text-xl">Create Account 🚀</h2>

        <input
          type="email"
          placeholder="Email"
          className="p-3 w-full"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-3 w-full"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="bg-green-500 w-full p-3"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}