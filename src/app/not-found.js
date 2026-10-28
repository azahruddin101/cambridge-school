import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-svh items-center bg-forest text-ivory">
      <div className="container-x py-40">
        <p className="eyebrow mb-8 text-gold-soft">Error 404</p>
        <h1 className="display-xl max-w-4xl">
          This page has wandered <em className="text-gold-soft">off campus.</em>
        </h1>
        <div className="mt-12">
          <Button href="/" variant="ivory">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
