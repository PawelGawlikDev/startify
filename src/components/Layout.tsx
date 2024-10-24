import React, { type ReactNode } from "react"

import Background from "./backgrounds/Background"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Background>
      <main>{children}</main>
    </Background>
  )
}
