/**
 * Simple test script for the embedding service endpoints
 * This script tests both the generate and query endpoints
 */

const BASE_URL = 'http://localhost:3001';

// Mock API key for testing (you should set OPENROUTER_API_KEY env var)
const TEST_API_KEY = process.env.OPENROUTER_API_KEY || 'test-key';

async function testGenerateEmbedding() {
  console.log('🧪 Testing generate embedding endpoint...');

  const response = await fetch(`${BASE_URL}/api/embeddings/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: 'The quick brown fox jumps over the lazy dog',
      metadata: { category: 'test', source: 'test-script' },
      apiKey: TEST_API_KEY
    })
  });

  const data = await response.json();

  if (response.ok) {
    console.log('✅ Generate embedding successful');
    console.log('   Generated ID:', data.id);
    console.log('   Embedding length:', data.embedding?.length);
    console.log('   Metadata:', data.metadata);
    return true;
  } else {
    console.log('❌ Generate embedding failed');
    console.log('   Error:', data.error);
    return false;
  }
}

async function testQueryEmbedding() {
  console.log('\n🔍 Testing query embedding endpoint...');

  const response = await fetch(`${BASE_URL}/api/embeddings/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'brown fox',
      limit: 5,
      threshold: 0.1,
      apiKey: TEST_API_KEY
    })
  });

  const data = await response.json();

  if (response.ok) {
    console.log('✅ Query embedding successful');
    console.log('   Query:', data.query);
    console.log('   Results count:', data.total);
    console.log('   Results:', data.results.map(r => ({
      similarity: r.similarity.toFixed(3),
      document: r.document?.substring(0, 50) + '...'
    })));
    return true;
  } else {
    console.log('❌ Query embedding failed');
    console.log('   Error:', data.error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting embedding service tests...\n');

  if (!TEST_API_KEY || TEST_API_KEY === 'test-key') {
    console.log('⚠️  Warning: Using test API key. Set OPENROUTER_API_KEY for real testing.\n');
  }

  try {
    // Test generation first
    const generateSuccess = await testGenerateEmbedding();

    if (!generateSuccess) {
      console.log('\n❌ Skipping query test due to generation failure');
      return;
    }

    // Wait a moment then test querying
    setTimeout(async () => {
      await testQueryEmbedding();
      console.log('\n✨ Embedding service tests completed!');
    }, 1000);

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Run the tests
runTests();