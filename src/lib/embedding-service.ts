/**
 * Embedding Service Utilities
 *
 * This module provides client-side utilities for interacting with the embedding API endpoints.
 * It includes functions for generating and querying embeddings using the Vercel AI SDK and Chroma DB.
 */

export interface EmbeddingMetadata {
  [key: string]: any;
  timestamp?: string;
}

export interface GenerateEmbeddingRequest {
  text: string;
  metadata?: EmbeddingMetadata;
  apiKey?: string;
}

export interface GenerateEmbeddingResponse {
  id: string;
  embedding: number[];
  text: string;
  metadata: EmbeddingMetadata;
  success: true;
}

export interface QueryEmbeddingRequest {
  query: string;
  limit?: number;
  threshold?: number;
  apiKey?: string;
}

export interface QueryResult {
  id: string;
  document: string;
  metadata: EmbeddingMetadata;
  distance: number;
  similarity: number;
}

export interface QueryEmbeddingResponse {
  query: string;
  results: QueryResult[];
  total: number;
  threshold: number;
  success: true;
  message?: string;
}

export interface EmbeddingError {
  error: string;
  success?: false;
}

/**
 * Generates an embedding for the provided text and stores it in the vector database
 *
 * @param request - The embedding generation request
 * @returns Promise with the generated embedding response or error
 */
export async function generateEmbedding(
  request: GenerateEmbeddingRequest
): Promise<GenerateEmbeddingResponse | EmbeddingError> {
  try {
    const response = await fetch('/api/embeddings/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Failed to generate embedding' };
    }

    return data;
  } catch (error) {
    return { error: 'Network error while generating embedding' };
  }
}

/**
 * Queries the vector database for similar embeddings
 *
 * @param request - The embedding query request
 * @returns Promise with the query results or error
 */
export async function queryEmbeddings(
  request: QueryEmbeddingRequest
): Promise<QueryEmbeddingResponse | EmbeddingError> {
  try {
    const response = await fetch('/api/embeddings/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Failed to query embeddings' };
    }

    return data;
  } catch (error) {
    return { error: 'Network error while querying embeddings' };
  }
}

/**
 * Utility function to batch generate embeddings for multiple texts
 *
 * @param texts - Array of texts to embed
 * @param metadata - Optional metadata to apply to all embeddings
 * @param apiKey - Optional API key override
 * @returns Promise with array of results
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  metadata?: EmbeddingMetadata,
  apiKey?: string
): Promise<(GenerateEmbeddingResponse | EmbeddingError)[]> {
  const promises = texts.map(text =>
    generateEmbedding({ text, metadata, apiKey })
  );

  return Promise.all(promises);
}

/**
 * Utility function to find the most similar documents to a query
 *
 * @param query - The search query
 * @param options - Query options
 * @returns Promise with the most similar documents
 */
export async function findSimilarDocuments(
  query: string,
  options: {
    limit?: number;
    threshold?: number;
    apiKey?: string;
  } = {}
): Promise<QueryResult[] | null> {
  const result = await queryEmbeddings({
    query,
    ...options,
  });

  if ('error' in result) {
    console.error('Error finding similar documents:', result.error);
    return null;
  }

  return result.results;
}

/**
 * Calculates cosine similarity between two vectors
 * This utility function can be used for additional similarity calculations
 *
 * @param vectorA - First vector
 * @param vectorB - Second vector
 * @returns Cosine similarity score between -1 and 1
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}