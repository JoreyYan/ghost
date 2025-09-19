import { NextRequest, NextResponse } from 'next/server'
import { FetchService } from '@/lib/fetch-service'

export async function POST(request: NextRequest) {
  try {
    const { sourceId } = await request.json()
    
    if (!sourceId) {
      return NextResponse.json(
        { error: 'Source ID is required' },
        { status: 400 }
      )
    }
    
    // 执行数据抓取
    const result = await FetchService.fetchAndSave(sourceId)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Fetch failed' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      newItems: result.newItems,
      message: `Successfully fetched ${result.newItems} new items`
    })
    
  } catch (error) {
    console.error('Fetch API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sourceId = searchParams.get('sourceId')
    
    if (!sourceId) {
      return NextResponse.json(
        { error: 'Source ID is required' },
        { status: 400 }
      )
    }
    
    // 获取源的抓取历史
    const { data: fetchRuns, error } = await supabase
      .from('fetch_runs')
      .select('*')
      .eq('source_id', sourceId)
      .order('started_at', { ascending: false })
      .limit(10)
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch history' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      fetchRuns
    })
    
  } catch (error) {
    console.error('Fetch history API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
