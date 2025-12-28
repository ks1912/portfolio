"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Mail, Github, Linkedin, Code2, TestTube2, Database, GitBranch, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5">
              <span className="text-sm font-medium text-blue-400">Senior SDET & QA Automation Architect</span>
            </div>

            <h1 className="mb-6 text-6xl font-bold leading-tight text-white text-balance max-w-4xl">Kunal Singh</h1>

            <p className="mb-8 max-w-3xl text-xl text-zinc-300 leading-relaxed">
              5+ Years Experience in Healthcare, E-commerce, & BFIS Domains. Expert in Playwright, Cypress, and Building
              Scalable Automation Frameworks.
            </p>

            <div className="flex items-center gap-4">
              <Button size="lg" className="group bg-blue-500 text-white hover:bg-blue-600" asChild>
                <a href="mailto:kunalsingh886312@gmail.com">
                  Hire Me
                  <Mail className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800 hover:text-white bg-transparent"
                asChild
              >
                <a href="/projects">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section className="border-t border-zinc-800 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">About Me</h2>
              <p className="max-w-4xl text-lg text-zinc-300 leading-relaxed">
                Driven and results-oriented SDET with over 5 years of experience delivering high-quality enterprise
                applications. Proven expertise in migrating monolithic architectures to microservices, implementing
                CI/CD pipelines (Jenkins, Docker, ArgoCD), and leading QA teams. Committed to SAFe Agile methodology and
                WCAG accessibility standards.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="border-t border-zinc-800 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-12 text-sm font-semibold uppercase tracking-wider text-blue-400">Skills & Expertise</h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Languages */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Code2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">JavaScript</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">TypeScript</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Python</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">YAML</span>
                  </div>
                </div>

                {/* Automation */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <TestTube2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Automation</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Playwright</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Cypress</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Selenium</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">POM</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Cucumber</span>
                  </div>
                </div>

                {/* API & Load Testing */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Zap className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">API & Load</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Rest Assured</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Postman</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">SOAP UI</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">K6</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Locust</span>
                  </div>
                </div>

                {/* DevOps & Infrastructure */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <GitBranch className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">DevOps & Infra</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Jenkins</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Docker</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">ArgoCD</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Helm</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Terraform</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">AWS</span>
                  </div>
                </div>

                {/* Database Testing */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Database className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Database Testing</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">MySQL</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">PostgreSQL</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">MongoDB</span>
                  </div>
                </div>

                {/* Specialized */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Specialized</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">WCAG</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Accessibility</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">AI/ML Tools</span>
                    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">Copilot</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Education Section */}
        <section className="border-t border-zinc-800 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-12 text-sm font-semibold uppercase tracking-wider text-blue-400">
                Education & Certifications
              </h2>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
                <h3 className="mb-2 text-xl font-semibold text-white">B.Tech in Computer Science</h3>
                <p className="text-zinc-400">Abhinav Hi-Tech College (JNTUH)</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="border-t border-zinc-800 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-12 text-sm font-semibold uppercase tracking-wider text-blue-400">Let's Connect</h2>

              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-4 text-lg text-zinc-300">
                    Ready to discuss automation strategies or explore opportunities?
                  </p>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600" asChild>
                    <a href="mailto:kunalsingh886312@gmail.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Get in Touch
                    </a>
                  </Button>
                </div>

                <div className="flex gap-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
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
