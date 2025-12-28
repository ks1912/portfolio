"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Cloud, Terminal, Shield } from "lucide-react"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mb-4 text-4xl font-bold text-white">Featured Projects</h1>
          <p className="mb-16 text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Real-world automation projects across Healthcare, E-commerce, and Banking domains.
          </p>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
            {/* Project 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group rounded-lg border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-blue-500/50"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Cloud className="h-6 w-6 text-blue-400" />
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  Healthcare
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Healthcare Automation & Microservices (Modmed)</h3>
              <p className="mb-4 text-zinc-400 leading-relaxed">
                Led a QA team of 3. Migrated testing from monolithic to microservices. Implemented infrastructure using
                Helm Charts and Terraform. Performed advanced SQL testing and WCAG accessibility audits.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Microservices</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Helm</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Terraform</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">SQL Testing</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">WCAG</span>
              </div>
            </motion.div>

            {/* Project 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group rounded-lg border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-blue-500/50"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Terminal className="h-6 w-6 text-blue-400" />
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  E-Commerce
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">E-Commerce Enterprise Framework (Feuji)</h3>
              <p className="mb-4 text-zinc-400 leading-relaxed">
                Developed Playwright/Cypress scripts for major US tech products like InsightsFirst and AnalyticsApp.
                Integrated Allure/Report Portal into CI/CD pipelines, significantly reducing manual effort.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Playwright</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Cypress</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">CI/CD</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Allure</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Report Portal</span>
              </div>
            </motion.div>

            {/* Project 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group rounded-lg border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-blue-500/50"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">BFIS</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                Banking & Fintech Quality Assurance (IDRBT - RBI)
              </h3>
              <p className="mb-4 text-zinc-400 leading-relaxed">
                Worked on UI automation frameworks using Selenium WebDriver and API testing with Rest Assured/SOAP UI
                for government financial systems.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Selenium</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Rest Assured</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">SOAP UI</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Banking</span>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">Government</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-500">© 2025 Kunal Singh. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Built with</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                Vibe Coding
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
