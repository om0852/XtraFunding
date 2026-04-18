import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = await req.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json({ success: false, message: 'User ID and content are required' }, { status: 400 });
    }

    const post = await Post.findById(resolvedParams.id);
    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    post.comments.push({
      author: userId,
      content,
      createdAt: new Date()
    });

    await post.save();
    
    // Repopulate explicitly to return the new comment perfectly populated
    const populatedPost = await Post.findById(post._id).populate('comments.author', 'name role');

    return NextResponse.json({ success: true, data: populatedPost?.comments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
