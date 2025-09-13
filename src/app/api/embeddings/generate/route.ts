import type { NextRequest } from 'next/server';

import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
import { ChromaClient } from 'chromadb';
import { NextResponse } from 'next/server';

// Use embedded Chroma client (no server required)
const chromaClient = new ChromaClient({
  path: process.env.CHROMA_DB_PATH || './chroma_db'
});

export async function POST(req: NextRequest) {
  try {
    const { text, metadata = {}, apiKey: key } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = key || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing OpenRouter API key.' },
        { status: 401 }
      );
    }

    const openai = createOpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1'
    });

    // Generate embedding using AI SDK
    const { embedding } = await embed({
      model: openai.textEmbeddingModel('text-embedding-3-small'),
      value: text,
    });

    // Get or create collection
    const collection = await chromaClient.getOrCreateCollection({
      name: 'embeddings',
      metadata: { description: 'Text embeddings collection' }
    });

    // Generate unique ID for the document
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store embedding in Chroma
    await collection.add({
      ids: [id],
      embeddings: [embedding],
      documents: [text],
      metadatas: [{ ...metadata, timestamp: new Date().toISOString() }]
    });

    return NextResponse.json({
      id,
      embedding,
      text,
      metadata: { ...metadata, timestamp: new Date().toISOString() },
      success: true
    });

  } catch (error) {
    console.error('Error generating embedding:', error);
    return NextResponse.json(
      { error: 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}