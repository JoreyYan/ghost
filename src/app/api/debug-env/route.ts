import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    const claudeApiKey = process.env.CLAUDE_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      claudeApiKey: claudeApiKey ? `${claudeApiKey.substring(0, 20)}...` : 'NOT SET',
      openaiApiKey: openaiApiKey ? `${openaiApiKey.substring(0, 20)}...` : 'NOT SET',
      preferredProvider: claudeApiKey ? 'Claude' : (openaiApiKey ? 'OpenAI' : 'None'),
      supabaseUrl: supabaseUrl || 'NOT SET',
      supabaseAnonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
