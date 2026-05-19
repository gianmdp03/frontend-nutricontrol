export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container">
      {/* Podés poner un fondo especial solo para login/register */}
      <main>{children}</main>
    </div>
  );
}