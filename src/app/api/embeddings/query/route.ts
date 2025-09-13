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
    const {
      query,
      limit = 10,
      threshold = 0.5,
      apiKey: key
    } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query text is required' },
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

    // Generate embedding for the query
    const { embedding } = await embed({
      model: openai.textEmbeddingModel('text-embedding-3-small'),
      value: query,
    });

    // Get the collection
    const collection = await chromaClient.getCollection({
      name: 'embeddings'
    });

    // Query similar embeddings
    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: limit,
      include: ['documents', 'metadatas', 'distances']
    });

    // Filter results by similarity threshold if provided
    const filteredResults = results.distances?.[0]
      ?.map((distance, index) => ({
        id: results.ids?.[0]?.[index],
        document: results.documents?.[0]?.[index],
        metadata: results.metadatas?.[0]?.[index],
        distance: distance ?? 0,
        similarity: 1 - (distance ?? 0) // Convert distance to similarity score
      }))
      .filter(result => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity) || [];

    return NextResponse.json({
      query,
      results: filteredResults,
      total: filteredResults.length,
      threshold,
      success: true
    });

  } catch (error) {
    console.error('Error querying embeddings:', error);

    // Handle case where collection doesn't exist
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        query: req.json().then(data => data.query).catch(() => ''),
        results: [],
        total: 0,
        threshold: req.json().then(data => data.threshold || 0.5).catch(() => 0.5),
        success: true,
        message: 'No embeddings collection found. Generate some embeddings first.'
      });
    }

    return NextResponse.json(
      { error: 'Failed to query embeddings' },
      { status: 500 }
    );
  }
}