"use server";

import { detectLanguageFromHeaders } from "@tolgee/react/server";
import { cookies, headers } from "next/headers";
import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from "./shared";

const LANGUAGE_COOKIE = "NEXT_LOCALE";

export async function setLanguage(locale: string) {
  const cookieStore = cookies();
  cookieStore.set(LANGUAGE_COOKIE, locale, {
    // One year
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
}

export async function getLanguage() {
  const cookieStore = cookies();
  const locale = cookieStore.get(LANGUAGE_COOKIE)?.value;
  if (locale && ALL_LANGUAGES.includes(locale)) {
    return locale;
  }

  // Try to detect language only if in a browser environment
  if (typeof window !== "undefined") {
    const detected = detectLanguageFromHeaders(headers(), ALL_LANGUAGES);
    return detected || DEFAULT_LANGUAGE;
  }

  return DEFAULT_LANGUAGE;
}
