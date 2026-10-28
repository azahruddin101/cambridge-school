export function ArrowIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M5 19L19 5M19 5H8M19 5v11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path
        d="M3 5.5C3 14.06 9.94 21 18.5 21c.39 0 .77-.01 1.15-.04.44-.03.66-.05.86-.16.17-.1.33-.26.42-.44.11-.21.11-.46.11-.96v-2.93c0-.42 0-.63-.07-.81a1 1 0 00-.28-.4c-.15-.12-.35-.2-.74-.34l-3.32-1.26c-.46-.17-.69-.26-.91-.24-.19.01-.37.08-.53.18-.18.12-.31.33-.58.73l-.91 1.36A12.2 12.2 0 018.5 9.88l1.36-.91c.4-.27.6-.4.73-.58.1-.16.17-.34.18-.53.02-.22-.07-.45-.24-.91L9.27 3.63c-.14-.39-.21-.59-.34-.74a1 1 0 00-.4-.28C8.35 2.54 8.14 2.54 7.72 2.54H4.79c-.5 0-.75 0-.96.11-.18.09-.34.25-.44.42-.11.2-.13.42-.16.86C3.01 4.31 3 4.69 3 5.08z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
