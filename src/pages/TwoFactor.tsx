import React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TwoFactor() {
  const navigate = useNavigate()

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/admin")
  }

  return (
    <Card className="w-full bg-bg-paper border-rule shadow-none">
      <CardHeader className="text-center border-none pb-0 mt-4">
        <CardTitle className="text-lg">Two-factor verification</CardTitle>
        <CardDescription className="pt-1 text-[13px]">Open your authenticator app to view your code</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center flex-col items-center space-y-4">
            <div className="flex gap-2 justify-center">
              {[...Array(6)].map((_, i) => (
                <Input 
                  key={i}
                  type="text" 
                  maxLength={1}
                  className="w-10 h-10 text-center font-mono text-lg"
                  placeholder="Â·"
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Button type="submit" className="w-full h-9">
              Verify
            </Button>
            <Button variant="ghost" type="button" className="w-full h-9 text-xs">
              Use backup code instead
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
