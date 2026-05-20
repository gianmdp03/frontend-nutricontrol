import BackToPageButton from "@/components/ui/BackToPageButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <BackToPageButton />
      <main>{children}</main>
    </div>
  );
}
