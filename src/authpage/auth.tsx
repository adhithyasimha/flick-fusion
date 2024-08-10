"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle authentication logic here
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backdrop.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Netflix Logo */}
      <div className="absolute top-4 left-4 z-10">
        <Image src="/netflix-logo.png" alt="Netflix" width={100} height={30} />
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/75 rounded-md">
        <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#333] border-none text-white placeholder-gray-500 h-12"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#333] border-none text-white placeholder-gray-500 h-12"
          />
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 h-12 font-semibold">
            Sign In
          </Button>
          <div className="flex items-center justify-between text-[#b3b3b3] text-sm">
            <div className="flex items-center">
              <Checkbox id="remember" className="border-gray-600" />
              <label htmlFor="remember" className="ml-2">Remember me</label>
            </div>
            <Link href="#" className="hover:underline">Need help?</Link>
          </div>
        </form>
        <Button variant="ghost" className="w-full mt-4 bg-[#333] text-white h-12">
          Use a sign-in code
        </Button>

      </div>
    </div>
  );
}