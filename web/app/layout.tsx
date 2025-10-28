import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SurfAI - AI Browser Agent',
  description: 'Autonomous AI browser agent with hybrid vision and MCP integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
