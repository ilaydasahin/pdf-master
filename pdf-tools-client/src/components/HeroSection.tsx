"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, ShieldCheck, Zap, Users, Cloud, Star } from "lucide-react";
import { Link } from "@/navigation";

export default function HeroSection() {
  const t = useTranslations("Hero");

  // Stats data
  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Files Processed", value: "1M+", icon: Cloud },
    { label: "User Rating", value: "4.9/5", icon: Star },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-20 sm:py-32 isolate">
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.400),transparent)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_bottom,theme(colors.purple.400),transparent)] opacity-10" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Announcement Badge */}
            <div className="mb-8 flex justify-center">
              <div className="group relative rounded-full px-4 py-1.5 text-sm leading-6 text-slate-300 ring-1 ring-white/10 hover:ring-white/20 bg-white/5 backdrop-blur-sm transition-all">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  {t("announcement") || "New features available."}
                  <Link
                    href="/workflows"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    Try Workflows <span aria-hidden="true">&rarr;</span>
                  </Link>
                </span>
              </div>
            </div>

            {/* Main Title with Gradient */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white animate-gradient">
                {t("title") || "All-in-one PDF Solution"}
              </span>
            </h1>

            <p className="mt-6 text-xl leading-8 text-slate-300 max-w-2xl mx-auto">
              {t("description") ||
                "Every tool you need to work with PDFs in one place. Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks."}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="#tools"
                className="group relative rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
              >
                <span className="flex items-center gap-2">
                  {t("getStarted") || "Get started"}
                  <span
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors group"
              >
                {t("learnMore") || "Learn more"}{" "}
                <span
                  className="inline-block group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 group cursor-default">
              <ShieldCheck
                className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                aria-hidden="true"
              />
              <span className="text-sm group-hover:text-slate-300 transition-colors">
                100% Secure & Private
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <Zap
                className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                aria-hidden="true"
              />
              <span className="text-sm group-hover:text-slate-300 transition-colors">
                Lightning Fast Processing
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <FileText
                className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                aria-hidden="true"
              />
              <span className="text-sm group-hover:text-slate-300 transition-colors">
                High Quality Output
              </span>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative rounded-2xl bg-white/5 backdrop-blur-sm p-6 ring-1 ring-white/10 hover:ring-indigo-400/50 transition-all hover:bg-white/10"
              >
                <div className="flex flex-col items-center gap-3">
                  <stat.icon className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
