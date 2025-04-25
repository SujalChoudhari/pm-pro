"use client"

import { marked } from "marked"

interface ParsedReadme {
  html: string
  summary: string
}

export async function parseReadme(content: string): Promise<ParsedReadme> {
  // Convert markdown to HTML
  const html = await marked(content)

  // Generate a summary from the content
  const summary = generateSummary(content)

  return {
    html,
    summary,
  }
}

function generateSummary(content: string): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/#+\s+(.*)/g, "$1") // Remove headings
    .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Remove links but keep text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/>\s+(.*)/g, "$1") // Remove blockquotes
    .replace(/!\[[^\]]*\]$$[^)]+$$/g, "") // Remove images
    .replace(/\n+/g, " ") // Replace multiple newlines with space
    .trim()

  // Get the first paragraph or first 250 characters
  const firstParagraph = plainText.split(/\n\s*\n/)[0] || ""

  if (firstParagraph.length <= 250) {
    return firstParagraph
  }

  // Truncate to ~250 chars at word boundary
  return firstParagraph.substring(0, 250).replace(/\s+\S*$/, "") + "..."
}
