'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [testResults, setTestResults] = useState<{
    connection: string;
    tables: string[];
    extensions: string[];
    timestamp: string;
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setConnectionStatus('testing')
    setError(null)
    setTestResults(null)

    try {
      // Test 1: Basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('categories')
        .select('count')
        .limit(1)

      if (connectionError) {
        throw new Error(`Connection failed: ${connectionError.message}`)
      }

      // Test 2: Check if tables exist
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (tablesError) {
        throw new Error(`Tables check failed: ${tablesError.message}`)
      }

      // Test 3: Test vector extension
      const { data: extensions, error: extensionsError } = await supabase
        .from('pg_extension')
        .select('extname')
        .in('extname', ['vector', 'uuid-ossp'])

      if (extensionsError) {
        throw new Error(`Extensions check failed: ${extensionsError.message}`)
      }

      setTestResults({
        connection: '✅ Connected successfully',
        tables: tables?.map(t => t.table_name) || [],
        extensions: extensions?.map(e => e.extname) || [],
        timestamp: new Date().toISOString()
      })
      setConnectionStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setConnectionStatus('error')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>
            Test your Supabase database connection and verify setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="w-32"
            >
              {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Badge variant={
              connectionStatus === 'success' ? 'default' :
              connectionStatus === 'error' ? 'destructive' :
              connectionStatus === 'testing' ? 'secondary' : 'outline'
            }>
              {connectionStatus === 'idle' ? 'Not tested' :
               connectionStatus === 'testing' ? 'Testing...' :
               connectionStatus === 'success' ? 'Success' : 'Error'}
            </Badge>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 className="font-medium text-red-800">Error:</h4>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {testResults && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="font-medium text-green-800">Test Results:</h4>
                <div className="mt-2 space-y-2">
                  <p className="text-green-700">{testResults.connection}</p>
                  
                  <div>
                    <p className="font-medium text-green-800">Tables found:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {testResults.tables.map((table: string) => (
                        <Badge key={table} variant="outline" className="text-xs">
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-green-800">Extensions:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {testResults.extensions.map((ext: string) => (
                        <Badge key={ext} variant="outline" className="text-xs">
                          {ext}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-green-600">
                    Test completed at: {new Date(testResults.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800">Environment Variables Check:</h4>
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-blue-700">
                NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </p>
              <p className="text-blue-700">
                NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </p>
              <p className="text-blue-700">
                SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


