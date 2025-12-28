"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PlayCircle, TestTube, Code2, FileCode, GitBranch, Settings, Cloud } from "lucide-react"

const cheatsheets = [
  {
    title: "Playwright",
    icon: PlayCircle,
    items: [
      { label: "Async/Await", code: "await page.click(selector)" },
      { label: "Locators", code: "page.locator('text=Submit')" },
      { label: "Trace Viewer", code: "await context.tracing.start()" },
    ],
  },
  {
    title: "Cypress",
    icon: TestTube,
    items: [
      { label: "Intercept", code: "cy.intercept('GET', '/api/*')" },
      { label: "Custom Commands", code: "Cypress.Commands.add(name, fn)" },
      { label: "Fixtures", code: "cy.fixture('data.json')" },
    ],
  },
  {
    title: "TypeScript",
    icon: Code2,
    items: [
      { label: "Interfaces", code: "interface User { name: string }" },
      { label: "Enums", code: "enum Status { Active, Inactive }" },
      { label: "Generics", code: "function id<T>(arg: T): T" },
    ],
  },
  {
    title: "JavaScript",
    icon: FileCode,
    items: [
      { label: "ES6+ Syntax", code: "const { name } = user" },
      { label: "Promises", code: "promise.then().catch()" },
      { label: "Map/Filter", code: "array.map(x => x * 2)" },
    ],
  },
  {
    title: "GitHub",
    icon: GitBranch,
    items: [
      { label: "Branching", code: "git checkout -b feature/new" },
      { label: "PR Workflow", code: "git push origin branch" },
      { label: "Actions", code: "on: [push, pull_request]" },
    ],
  },
  {
    title: "Jenkins",
    icon: Settings,
    items: [
      { label: "Pipeline Syntax", code: "pipeline { agent any }" },
      { label: "Groovy", code: "def buildNumber = env.BUILD_ID" },
      { label: "Plugins", code: 'stage("Test") { steps {} }' },
    ],
  },
  {
    title: "AWS",
    icon: Cloud,
    items: [
      { label: "S3", code: "aws s3 cp file.txt s3://bucket" },
      { label: "EC2", code: "aws ec2 describe-instances" },
      { label: "CloudWatch", code: "aws logs get-log-events" },
    ],
  },
]

export default function CheatsheetsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mb-4 text-4xl font-bold text-white">Developer Reference</h1>
          <p className="mb-16 text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Quick reference guide for essential methods and commands across my core technology stack.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cheatsheets.map((sheet, index) => {
              const Icon = sheet.icon
              return (
                <motion.div
                  key={sheet.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-blue-500/50"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{sheet.title}</h2>
                  </div>

                  <div className="space-y-3">
                    {sheet.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-1">
                        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{item.label}</div>
                        <code className="block rounded bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300 overflow-x-auto border border-zinc-800">
                          {item.code}
                        </code>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 mt-24">
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
