export default function Footer() {
  return (
    <footer className="relative flex flex-wrap items-center justify-between border-t border-border bg-card px-4 py-12 pt-8">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Ebrahim Gory. All rights reserved.
      </p>
    </footer>
  );
}
