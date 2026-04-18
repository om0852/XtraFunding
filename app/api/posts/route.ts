import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User'; // Ensure User is registered to populate

import { put } from '@vercel/blob';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Fetch posts, fully populating the author
    const posts = await Post.find()
      .populate('author', 'name profileMetadata startupDetails role')
      .populate('comments.author', 'name role')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, count: posts.length, data: posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const authorId = formData.get('authorId') as string;
    const content = formData.get('content') as string;
    const mediaFile = formData.get('media') as File | null;
    
    if (!authorId || !content) {
       return NextResponse.json({ success: false, message: 'Author ID and content are required' }, { status: 400 });
    }

    let storageUrl = '';
    
    if (mediaFile && mediaFile.size > 0) {
      const blob = await put(mediaFile.name, mediaFile, {
          access: 'public',
      });
      storageUrl = blob.url;
    }

    const post = await Post.create({
      author: authorId,
      content,
      imageUrl: storageUrl,
      likes: []
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name profileMetadata startupDetails role');

    return NextResponse.json({ success: true, data: populatedPost }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
