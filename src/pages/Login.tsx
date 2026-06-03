import React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/admin/2fa")
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full bg-bg-paper border-rule shadow-none">
        <CardHeader className="text-center border-none pb-0 mt-4">
          <CardTitle className="text-lg">Sign in to continue</CardTitle>
          <CardDescription className="pt-1 text-[13px]">Enter your admin credentials</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 flex flex-col">
              <label className="text-xs font-medium text-stone">Email address</label>
              <Input 
                type="email" 
                placeholder="you@voltex.finance" 
                required
                className="font-mono text-xs" 
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-medium text-stone">Password</label>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full h-9">
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="text-[10px] font-mono tracking-wide uppercase px-2 py-0.5 rounded-sm bg-bad/20 text-bad border border-bad/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-bad rounded-full inline-block animate-pulse"></span>
          PROD ENVIRONMENT
        </div>
      </div>
    </div>
  )
}
