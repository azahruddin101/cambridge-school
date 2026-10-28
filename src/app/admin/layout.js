export const metadata = {
  title: { default: "Admin", template: "%s · Admin · Eastern Cambridge School" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-svh bg-ivory font-sans text-ink">{children}</div>;
}
