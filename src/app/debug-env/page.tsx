"use client"

import { useEffect, useState } from "react"

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    setEnvVars({
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      'NODE_ENV': process.env.NODE_ENV || 'NOT_SET'
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex gap-4">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{key}</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {value}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
        <button 
          onClick={async () => {
            try {
              const { createClient } = await import('@supabase/supabase-js')
              const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || '',
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
              )
              
              const { data, error } = await supabase
                .from('sources')
                .select('*')
                .limit(1)
              
              if (error) {
                alert(`Error: ${error.message}`)
              } else {
                alert(`Success! Found ${data?.length || 0} sources`)
              }
            } catch (err) {
              alert(`Exception: ${err}`)
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Supabase Connection
        </button>
      </div>
    </div>
  )
}
