"use client";

import { PropsWithChildren, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SocketProviderClient from "@/providers/socket-provider";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProviderClient>{children}</SocketProviderClient>
    </QueryClientProvider>
  );
};

export default Providers;
