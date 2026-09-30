import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[1088px] flex-col justify-center px-4 py-24 sm:px-6">
      <p className="eyebrow">404 / no route</p>
      <h1 className="h-page mt-6">This route does not verify.</h1>
      <p className="lede mt-6 max-w-[520px] text-muted">The page you asked for is not in the catalog. Try the models, the docs or the home page.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-cut btn-dot btn-solid-dark">
          Home <ArrowRight className="size-4" />
        </Link>
        <Link href="/models" className="btn btn-outline-dark">
          Models <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
