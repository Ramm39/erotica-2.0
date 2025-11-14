import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <Component {...pageProps} />
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    background: '#111111',
                                    color: '#F2F2F2',
                                    border: '1px solid #0D0D0D',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#2ECC71',
                                        secondary: '#F2F2F2',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#FF0033',
                                        secondary: '#F2F2F2',
                                    },
                                },
                            }}
                        />
                    </NotificationProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

