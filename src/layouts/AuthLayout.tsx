import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-base text-cream p-4">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-lime rounded-sm text-bg-base font-display font-bold flex items-center justify-center text-sm">V</div>
          <div className="font-display font-medium text-xl tracking-tight">
            <span className="text-cream">Volt</span>
            <span className="text-lime">Admin</span>
          </div>
        </div>
        
        <Outlet />
        
        <div className="mt-8 text-center text-xs text-stone">
          Admin access is logged. Unauthorized attempts will be reported.
        </div>
      </div>
    </div>
  )
}
