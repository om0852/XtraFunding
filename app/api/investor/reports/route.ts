import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Investment from '@/lib/models/Investment';
import Campaign from '@/lib/models/Campaign';

const COLORS = ['#1B3A6B', '#F5A623', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444'];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const investorId = searchParams.get('investorId');

    if (!investorId) {
      return NextResponse.json({ error: 'Investor ID is required' }, { status: 400 });
    }

    // Ensure Campaign model is registered before populating
    const _campaignModel = Campaign;

    // Fetch all investments for this investor, populated with campaign data
    const investments = await Investment.find({ investorId })
      .populate('campaignId')
      .sort({ createdAt: 1 });

    let netPortfolioWorth = 0;
    let totalRealizedYield = 0; // Mocked for now, or calculated from Debt campaigns
    const sectorMap: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    investments.forEach((inv) => {
      // Net Portfolio Worth
      netPortfolioWorth += inv.amount;

      // Ensure campaign data exists
      if (inv.campaignId) {
        const campaign = inv.campaignId as any; // Type assertion

        // Calculate a mocked yield based on Debt campaigns or general appreciation
        if (campaign.fundingType === 'Debt' && campaign.interestRate) {
          totalRealizedYield += (inv.amount * campaign.interestRate) / 100;
        } else {
          totalRealizedYield += inv.amount * 0.05; // 5% mock yield for equity
        }

        // Sector Allocation
        const sector = campaign.sector || 'Other';
        sectorMap[sector] = (sectorMap[sector] || 0) + inv.amount;
      }

      // Monthly Performance
      const date = new Date(inv.createdAt);
      const month = date.toLocaleString('default', { month: 'short' }); // e.g., 'Jan'
      monthlyMap[month] = (monthlyMap[month] || 0) + inv.amount;
    });

    // Format Sector Allocation
    const sectorAllocation = Object.entries(sectorMap).map(([name, value], index) => {
      const percentage = netPortfolioWorth > 0 ? Math.round((value / netPortfolioWorth) * 100) : 0;
      return {
        name,
        value,
        formattedValue: `₹${value.toLocaleString('en-IN')}`,
        percentage,
        color: COLORS[index % COLORS.length]
      };
    }).sort((a, b) => b.value - a.value);

    // Format Monthly Performance
    // Ensure chronological order by sorting keys if necessary, but we can just map the grouped data
    // The investments were already sorted by createdAt, so iterating over them created the keys in chronological order.
    const monthlyPerformance = Object.entries(monthlyMap).map(([month, value]) => ({
      month,
      value
    }));

    // Mock reports list since actual PDF generation is separate
    const reports = [
      { id: '1', name: 'Q1 2025 Performance Summary', type: 'PDF', date: 'Apr 01, 2025', status: 'Generated' },
      { id: '2', name: 'Annual Tax Certificate FY24', type: 'PDF', date: 'Mar 15, 2025', status: 'Verified' },
      { id: '3', name: 'Portfolio Allocation CSV', type: 'CSV', date: 'Mar 01, 2025', status: 'Ready' },
    ];

    return NextResponse.json({
      success: true,
      data: {
        netPortfolioWorth,
        totalRealizedYield: Math.round(totalRealizedYield),
        sectorAllocation,
        monthlyPerformance,
        reports
      }
    });

  } catch (error: any) {
    console.error('Error fetching investor reports:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
