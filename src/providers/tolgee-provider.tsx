"use client";

import { Tolgee, DevTools, TolgeeProvider, FormatSimple } from "@tolgee/react";
import { ReactNode } from "react";

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    availableLanguages: ["en", "cs", "fr", "de"],

    apiUrl: process.env.TOLGEE_API_URL,
    apiKey: process.env.TOLGEE_API_KEY,

    fallbackLanguage: "en",
    defaultLanguage: "en",
  });

export default function TolgeeProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TolgeeProvider tolgee={tolgee} fallback="Loading...">
      {children}
    </TolgeeProvider>
  );
}
