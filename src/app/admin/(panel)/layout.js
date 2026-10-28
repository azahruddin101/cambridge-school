import { Suspense } from "react";
import Sidebar from "@/components/admin/Sidebar";
import NewEnquiriesBadge from "@/components/admin/NewEnquiriesBadge";
import { Spinner, ToastProvider } from "@/components/admin/ui";

function Loading() {
  return (
    <div className="flex items-center gap-3 py-24 text-sm text-ink/55">
      <Spinner /> Loading…
    </div>
  );
}

export default function PanelLayout({ children }) {
  return (
    <ToastProvider>
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <Sidebar
          enquiriesBadge={
            <Suspense fallback={null}>
              <NewEnquiriesBadge />
            </Suspense>
          }
        />
        <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-6xl">
            {/* Admin pages read the session cookie and fresh data at request time */}
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
