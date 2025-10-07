import Link from "next/link";

export function SimpleFooter() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Offscript. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
