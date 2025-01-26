import React, { useEffect, type ReactNode } from "react";

import { checkUserSettings } from "~utils/checkUserSettings";

import Background from "./backgrounds/Background";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  useEffect(() => {
    (async () => {
      await checkUserSettings();
    })();
  }, []);

  return (
    <Background>
      <main className="min-h-screen">{children}</main>
    </Background>
  );
}
