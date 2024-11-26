import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";  // Import SessionProvider
import { AuthProvider } from '../context/Authcontext';  // Import your custom AuthProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>  {/* Wrap your app in SessionProvider */}
      <AuthProvider>  {/* Optionally, you can still use AuthProvider */}
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}
