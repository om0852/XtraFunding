import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User'; // Ensure User is registered to populate

import { put } from '@vercel/blob';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Force model registration to avoid tree-shaking stripping the unused import
    User.init();
    
    // Fetch posts, fully populating the author
    const posts = await Post.find()
      .populate('author', 'name profileMetadata startupDetails role')
      .populate('comments.author', 'name role')
      .sort({ createdAt: -1 });
    
    // Filter out orphaned posts whose author no longer exists in the DB
    const validPosts = posts.filter((p: any) => p.author !== null);
    
    return NextResponse.json({ success: true, count: validPosts.length, data: validPosts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    User.init();
    
    const formData = await req.formData();
    const authorId = formData.get('authorId') as string;
    const content = formData.get('content') as string;
    const mediaFile = formData.get('media') as File | null;
    
    if (!authorId || !content) {
       return NextResponse.json({ success: false, message: 'Author ID and content are required' }, { status: 400 });
    }

    // Validate the author actually exists in the DB
    const authorExists = await User.findById(authorId);
    if (!authorExists) {
      return NextResponse.json({ success: false, message: 'Author not found. Please login again.' }, { status: 404 });
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
