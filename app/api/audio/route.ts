import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

export async function POST(request: Request) {
  try {
    const { audioData } = await request.json();

    // Convert audio data to vector embedding
    // This is a placeholder - you'll need to implement your specific
    // audio-to-vector transformation using TensorFlow.js or another method
    const vector = audioData;

    // Upsert the vector to Pinecone
    await index.upsert([
      {
        id: Date.now().toString(),
        values: vector,
        metadata: {
          timestamp: new Date().toISOString(),
          type: 'audio'
        }
      }
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Query the most recent vectors
    const queryResponse = await index.query({
      vector: new Array(1536).fill(0), // Replace with your vector dimension
      topK: 10,
      includeMetadata: true
    });

    return NextResponse.json(queryResponse);
  } catch (error) {
    console.error('Error querying vectors:', error);
    return NextResponse.json(
      { error: 'Failed to query vectors' },
      { status: 500 }
    );
  }
} 