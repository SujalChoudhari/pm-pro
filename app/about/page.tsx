"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="container py-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">About PM Pro</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>What is PM Pro?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <p>
              PM Pro (Project Manager Pro) is a powerful tool designed to help developers manage and organize their GitHub projects efficiently. 
              It provides a centralized dashboard to track multiple repositories, manage favorites, organize with tags, and view project statistics.
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Key Features:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Centralized dashboard for all your GitHub projects</li>
                <li>Automatic project scanning from local directories</li>
                <li>Project favoriting and tagging system</li>
                <li>Detailed project statistics and insights</li>
                <li>README preview and project details at a glance</li>
                <li>Dark/Light theme support</li>
                <li>Responsive and modern interface</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">How to Use:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Add project directories in Settings to scan for Git repositories</li>
                <li>Enable auto-scan if desired for automatic project discovery</li>
                <li>Use tags to organize projects by technology or status</li>
                <li>Star important projects to access them quickly from Favorites</li>
                <li>View detailed statistics about your projects in the Stats page</li>
                <li>Use the search function to quickly find specific projects</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>The Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold">Sujal Choudhari</h3>
                    <p className="text-sm text-muted-foreground">Lead Developer</p>
                    <a
                      href="https://github.com/SujalChoudhari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-blue hover:underline mt-2"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold">Tanay Shah</h3>
                    <p className="text-sm text-muted-foreground">Developer</p>
                    <a
                      href="https://github.com/tms04"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-blue hover:underline mt-2"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold">Surabhkumar Sharma</h3>
                    <p className="text-sm text-muted-foreground">Developer</p>
                    <a
                      href="https://github.com/saurabhk1410"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-blue hover:underline mt-2"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-1">
                Made with <Heart className="h-4 w-4 text-blue-500" /> by the PM Pro Team
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}