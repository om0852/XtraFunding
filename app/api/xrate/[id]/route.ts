import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import XRateReport from '@/lib/models/XRateReport';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const report = await XRateReport.findById(id);
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Fetch XRateReport error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
