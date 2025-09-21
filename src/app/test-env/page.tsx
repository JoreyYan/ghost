"use client"

export default function TestEnvPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-4">
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
            {supabaseUrl || 'NOT SET'}
          </div>
        </div>
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
            {supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET'}
          </div>
        </div>
        <div>
          <strong>Expected URL:</strong>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
            https://kiwcuvmnlcldrmgskhrh.supabase.co
          </div>
        </div>
      </div>
    </div>
  )
}
