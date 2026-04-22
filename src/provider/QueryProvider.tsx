import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configure QueryClient with optimal settings for search
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Keep cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed queries once
      retry: 1,
      // Don't refetch on window focus for search (saves bandwidth)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect
      refetchOnReconnect: false,
      // Don't refetch on mount if we have data
      refetchOnMount: false,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {/* {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
};