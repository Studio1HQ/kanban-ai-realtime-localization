"use client";

import { TolgeeBase } from "@/tolgee/shared";
import { TolgeeProvider, TolgeeStaticData } from "@tolgee/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  language: string;
  staticData: TolgeeStaticData;
  children: React.ReactNode;
};

const tolgee = TolgeeBase().init();

export const TolgeeProviderClient = ({
  language,
  staticData,
  children,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    const { unsubscribe } = tolgee.on("permanentChange", () => {
      router.refresh();
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <TolgeeProvider
      tolgee={tolgee}
      options={{ useSuspense: false }}
      fallback="Loading..."
      ssr={{
        language,
        staticData,
      }}
    >
      {children}
    </TolgeeProvider>
  );
};
