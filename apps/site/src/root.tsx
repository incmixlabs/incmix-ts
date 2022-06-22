// @refresh reload
import { Routes } from "solid-start/root";
import { ErrorBoundary } from "solid-start/error-boundary";
import { Suspense } from "solid-js";
import { ThemeProvider } from "@incmix/ui";

export default function Root() {
  return (
    <>
      <ErrorBoundary>
        <Suspense>
          <ThemeProvider>
            <Routes />
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
