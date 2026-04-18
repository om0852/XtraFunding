import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import dbConnect from '@/lib/db';
import Xverify from '@/lib/models/Xverify';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();

    const aadharFile = formData.get('aadhar') as File | null;
    const panFile = formData.get('pan') as File | null;
    const licenseFile = formData.get('companyLicense') as File | null;

    if (!aadharFile || !panFile || !licenseFile) {
      return NextResponse.json(
        { error: 'All three documents (Aadhar, PAN, Company License) are required.' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const aadharBlob = await put(`xverify/aadhar-${Date.now()}-${aadharFile.name}`, aadharFile, { access: 'public' });
    const panBlob = await put(`xverify/pan-${Date.now()}-${panFile.name}`, panFile, { access: 'public' });
    const licenseBlob = await put(`xverify/license-${Date.now()}-${licenseFile.name}`, licenseFile, { access: 'public' });

    // Save to Database
    const xverifyRecord = await Xverify.create({
      aadharUrl: aadharBlob.url,
      panUrl: panBlob.url,
      companyLicenseUrl: licenseBlob.url,
    });

    return NextResponse.json({ success: true, record: xverifyRecord }, { status: 201 });
  } catch (error: any) {
    console.error('Xverify upload error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
