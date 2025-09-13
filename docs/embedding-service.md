# Embedding Service API Documentation

The Embedding Service provides endpoints for generating and querying text embeddings using the Vercel AI SDK and Chroma vector database. This service enables semantic search, similarity matching, and retrieval-augmented generation (RAG) capabilities.

## Overview

The service consists of two main endpoints:
- **Generate**: Create embeddings from text and store them in the vector database
- **Query**: Search for similar embeddings using semantic similarity

## Base URL

```
http://localhost:3001/api/embeddings
```

## Authentication

All endpoints require an OpenRouter API key. You can provide it in two ways:

1. **Environment Variable**: Set `OPENROUTER_API_KEY` in your environment
2. **Request Body**: Include `apiKey` field in the request payload

## Endpoints

### Generate Embedding

Creates an embedding for the provided text and stores it in the vector database.

#### Request

```http
POST /api/embeddings/generate
Content-Type: application/json
```

#### Request Body

```json
{
  "text": "string (required) - The text to embed",
  "metadata": "object (optional) - Additional metadata to store with the embedding",
  "apiKey": "string (optional) - OpenRouter API key override"
}
```

#### Response

**Success (200 OK)**
```json
{
  "id": "doc_1694123456789_abc123def",
  "embedding": [0.1234, -0.5678, ...],
  "text": "The original text that was embedded",
  "metadata": {
    "category": "example",
    "timestamp": "2023-09-08T10:30:45.123Z"
  },
  "success": true
}
```

**Error Responses**
```json
// Missing text
{
  "error": "Text is required"
}

// Missing API key
{
  "error": "Missing OpenRouter API key."
}

// Server error
{
  "error": "Failed to generate embedding"
}
```

#### Example

```javascript
const response = await fetch('/api/embeddings/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'The quick brown fox jumps over the lazy dog',
    metadata: {
      category: 'animals',
      source: 'example'
    }
  })
});

const result = await response.json();
console.log('Generated embedding:', result.id);
```

### Query Embeddings

Searches the vector database for embeddings similar to the provided query text.

#### Request

```http
POST /api/embeddings/query
Content-Type: application/json
```

#### Request Body

```json
{
  "query": "string (required) - The search query text",
  "limit": "number (optional, default: 10) - Maximum number of results to return",
  "threshold": "number (optional, default: 0.5) - Minimum similarity threshold (0-1)",
  "apiKey": "string (optional) - OpenRouter API key override"
}
```

#### Response

**Success (200 OK)**
```json
{
  "query": "brown fox",
  "results": [
    {
      "id": "doc_1694123456789_abc123def",
      "document": "The quick brown fox jumps over the lazy dog",
      "metadata": {
        "category": "animals",
        "timestamp": "2023-09-08T10:30:45.123Z"
      },
      "distance": 0.123,
      "similarity": 0.877
    }
  ],
  "total": 1,
  "threshold": 0.5,
  "success": true
}
```

**Empty Results**
```json
{
  "query": "search term",
  "results": [],
  "total": 0,
  "threshold": 0.5,
  "success": true,
  "message": "No embeddings collection found. Generate some embeddings first."
}
```

**Error Responses**
```json
// Missing query
{
  "error": "Query text is required"
}

// Missing API key
{
  "error": "Missing OpenRouter API key."
}

// Server error
{
  "error": "Failed to query embeddings"
}
```

#### Example

```javascript
const response = await fetch('/api/embeddings/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'fox jumping',
    limit: 5,
    threshold: 0.7
  })
});

const result = await response.json();
console.log(`Found ${result.total} similar documents`);
result.results.forEach(item => {
  console.log(`Similarity: ${item.similarity.toFixed(3)} - ${item.document}`);
});
```

## Client Library

The service includes a TypeScript client library at `src/lib/embedding-service.ts` with the following functions:

### generateEmbedding()

```typescript
import { generateEmbedding } from '@/lib/embedding-service';

const result = await generateEmbedding({
  text: 'Your text here',
  metadata: { category: 'example' }
});

if ('error' in result) {
  console.error('Error:', result.error);
} else {
  console.log('Generated:', result.id);
}
```

### queryEmbeddings()

```typescript
import { queryEmbeddings } from '@/lib/embedding-service';

const result = await queryEmbeddings({
  query: 'search term',
  limit: 10,
  threshold: 0.6
});

if ('error' in result) {
  console.error('Error:', result.error);
} else {
  console.log('Found:', result.results);
}
```

### generateEmbeddingsBatch()

```typescript
import { generateEmbeddingsBatch } from '@/lib/embedding-service';

const texts = ['First text', 'Second text', 'Third text'];
const results = await generateEmbeddingsBatch(texts, { source: 'batch' });

results.forEach((result, index) => {
  if ('error' in result) {
    console.error(`Error for text ${index}:`, result.error);
  } else {
    console.log(`Generated ${index}:`, result.id);
  }
});
```

### findSimilarDocuments()

```typescript
import { findSimilarDocuments } from '@/lib/embedding-service';

const similar = await findSimilarDocuments('search query', {
  limit: 5,
  threshold: 0.8
});

if (similar) {
  similar.forEach(doc => {
    console.log(`${doc.similarity.toFixed(3)}: ${doc.document}`);
  });
}
```

## Configuration

### Environment Variables

```bash
# Required: OpenRouter API key for embedding generation
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Custom path for Chroma database files (default: ./chroma_db)
CHROMA_DB_PATH=/path/to/chroma/data
```

### Embedding Model

The service uses OpenAI's `text-embedding-3-small` model via OpenRouter for generating embeddings. This provides:

- **Dimensions**: 1536 (default)
- **Context Length**: 8192 tokens
- **Use Cases**: Semantic search, clustering, classification

## Data Storage

### Vector Database

- **Engine**: Chroma DB (embedded mode)
- **Storage**: Local filesystem (configurable via `CHROMA_DB_PATH`)
- **Collection**: `embeddings` (auto-created)
- **Persistence**: Data persists between server restarts

### Data Structure

Each embedding document contains:

```typescript
{
  id: string;           // Unique identifier
  embedding: number[];  // 1536-dimensional vector
  document: string;     // Original text
  metadata: {           // Custom metadata
    timestamp: string;  // ISO timestamp (auto-added)
    [key: string]: any; // User-defined fields
  }
}
```

## Similarity Scoring

The service uses cosine distance for similarity calculations:

- **Distance**: 0 (identical) to 2 (opposite)
- **Similarity**: `1 - distance` (0 to 1)
- **Threshold**: Higher values = more similar results only

## Error Handling

Common error scenarios and responses:

| Scenario | Status Code | Error Message |
|----------|-------------|---------------|
| Missing text | 400 | "Text is required" |
| Missing query | 400 | "Query text is required" |
| Missing API key | 401 | "Missing OpenRouter API key." |
| Empty collection | 200 | Success with empty results + message |
| Server error | 500 | "Failed to generate/query embedding" |

## Rate Limits

Rate limits depend on your OpenRouter account limits. The service makes one API call per:
- Generate request (1 embedding)
- Query request (1 embedding for the query)

## Performance Considerations

- **Batch Processing**: Use `generateEmbeddingsBatch()` for multiple texts
- **Threshold Tuning**: Higher thresholds (0.7-0.9) for precise matches
- **Limit Setting**: Use reasonable limits (5-20) for better performance
- **Metadata**: Keep metadata objects small for optimal storage

## Development

### Testing

Use the included test script:

```bash
# Set your API key
export OPENROUTER_API_KEY=your_key_here

# Run the test script
node test-embeddings.js
```

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# The service will be available at http://localhost:3001/api/embeddings
```

### Type Checking

```bash
# Run TypeScript checks
pnpm typecheck

# The embedding service should pass all type checks
```

## Use Cases

### Semantic Search

```typescript
// 1. Add documents
await generateEmbedding({
  text: 'How to bake chocolate chip cookies',
  metadata: { category: 'recipe', type: 'dessert' }
});

// 2. Search semantically
const results = await queryEmbeddings({
  query: 'cookie baking instructions',
  threshold: 0.7
});
```

### Content Recommendation

```typescript
// Find similar articles
const similar = await findSimilarDocuments(currentArticle.content, {
  limit: 5,
  threshold: 0.6
});
```

### Retrieval-Augmented Generation (RAG)

```typescript
// 1. Store knowledge base
const knowledge = ['Fact 1...', 'Fact 2...', 'Fact 3...'];
await generateEmbeddingsBatch(knowledge);

// 2. Retrieve relevant context
const context = await findSimilarDocuments(userQuestion, {
  limit: 3,
  threshold: 0.5
});

// 3. Use context with LLM (separate implementation)
```

## Troubleshooting

### Common Issues

1. **"Missing OpenRouter API key"**
   - Set `OPENROUTER_API_KEY` environment variable
   - Or include `apiKey` in request body

2. **"No embeddings collection found"**
   - Generate some embeddings first before querying
   - Check Chroma database path permissions

3. **Low similarity scores**
   - Try lowering the threshold (e.g., 0.3-0.5)
   - Check if your query text is semantically related

4. **Slow performance**
   - Reduce batch sizes
   - Use appropriate limits
   - Consider caching frequent queries

### Debugging

Enable verbose logging by checking the server console output when making requests. The service logs errors to the console for debugging purposes.