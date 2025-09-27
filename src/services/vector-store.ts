import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    type: 'template_structure' | 'examples' | 'best_practices' | 'features' | 'guidelines';
    section: string;
    source: string;
  };
}

export class VectorStore {
  private openai: OpenAI;
  private chunks: DocumentChunk[] = [];
  private embeddings: Map<string, number[]> = new Map();

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key') {
      throw new Error('OPENAI_API_KEY is required for vector store');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async initialize(): Promise<void> {
    console.log('Initializing vector store with documentation...');
    await this.loadDocumentation();
    await this.generateEmbeddings();
    console.log(`Vector store initialized with ${this.chunks.length} chunks`);
  }

  private async loadDocumentation(): Promise<void> {
    try {
      // Load the transactional template guide
      const guidePath = join(process.cwd(), 'docs', 'TRANSACTIONAL_TEMPLATE_GUIDE.md');
      const guideContent = readFileSync(guidePath, 'utf-8');
      
      // Split into meaningful chunks
      this.chunks = this.splitIntoChunks(guideContent);
      
      // Add additional template examples
      this.addTemplateExamples();
      
    } catch (error) {
      console.error('Error loading documentation:', error);
      throw error;
    }
  }

  private splitIntoChunks(content: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const lines = content.split('\n');
    let currentChunk = '';
    let currentSection = '';
    let chunkId = 0;

    for (const line of lines) {
      // Detect section headers
      if (line.startsWith('## ')) {
        if (currentChunk.trim()) {
          chunks.push({
            id: `chunk_${chunkId++}`,
            content: currentChunk.trim(),
            metadata: {
              type: this.determineChunkType(currentSection),
              section: currentSection,
              source: 'TRANSACTIONAL_TEMPLATE_GUIDE.md'
            }
          });
          currentChunk = '';
        }
        currentSection = line.replace('## ', '').trim();
      }
      
      currentChunk += line + '\n';
      
      // Split large chunks
      if (currentChunk.length > 2000) {
        chunks.push({
          id: `chunk_${chunkId++}`,
          content: currentChunk.trim(),
          metadata: {
            type: this.determineChunkType(currentSection),
            section: currentSection,
            source: 'TRANSACTIONAL_TEMPLATE_GUIDE.md'
          }
        });
        currentChunk = '';
      }
    }

    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push({
        id: `chunk_${chunkId++}`,
        content: currentChunk.trim(),
        metadata: {
          type: this.determineChunkType(currentSection),
          section: currentSection,
          source: 'TRANSACTIONAL_TEMPLATE_GUIDE.md'
        }
      });
    }

    return chunks;
  }

  private determineChunkType(section: string): DocumentChunk['metadata']['type'] {
    const lowerSection = section.toLowerCase();
    
    if (lowerSection.includes('example') || lowerSection.includes('template')) {
      return 'examples';
    } else if (lowerSection.includes('practice') || lowerSection.includes('guideline')) {
      return 'best_practices';
    } else if (lowerSection.includes('feature') || lowerSection.includes('variable')) {
      return 'features';
    } else if (lowerSection.includes('structure') || lowerSection.includes('reference')) {
      return 'template_structure';
    } else {
      return 'guidelines';
    }
  }

  private addTemplateExamples(): void {
    const examples: DocumentChunk[] = [
      {
        id: 'example_welcome',
        content: `Welcome Email Template:
{
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Welcome to Waymore!",
    "custom_content": "Hello John,<br><br>Welcome to our platform! Your account is ready to use.",
    "cta_primary": {"label": "Get Started", "url": "https://app.waymore.io/dashboard"}
  }
}`,
        metadata: {
          type: 'examples',
          section: 'Welcome Email',
          source: 'examples'
        }
      },
      {
        id: 'example_order_confirmation',
        content: `Order Confirmation Template:
{
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Order Confirmation - #ORD-2024-001",
    "custom_content": "Hello John,<br><br>🎉 <strong>Thank you for your purchase!</strong><br><br>Your order has been confirmed and is being prepared for shipment.",
    "facts": [
      {"label": "Order ID", "value": "#ORD-2024-001"},
      {"label": "Items", "value": "2 items"},
      {"label": "Estimated Delivery", "value": "3-5 business days"},
      {"label": "Status", "value": "Processing"}
    ],
    "cta_primary": {"label": "Track Order", "url": "https://app.waymore.io/track/ORD-2024-001"},
    "cta_secondary": {"label": "View Order Details", "url": "https://app.waymore.io/orders/ORD-2024-001"},
    "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&auto=format",
    "image_alt": "Order shipped illustration",
    "theme": {
      "primary_button_color": "#6c5ce7",
      "text_color": "#2d3436",
      "heading_color": "#2d3436",
      "background_color": "#f8f9fa",
      "body_background": "#f1f2f6"
    }
  }
}`,
        metadata: {
          type: 'examples',
          section: 'Order Confirmation',
          source: 'examples'
        }
      },
      {
        id: 'example_payment_success',
        content: `Payment Success Template:
{
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Payment Successful - Receipt #12345",
    "custom_content": "Hello John,<br><br>✅ <strong>Payment Successful!</strong><br><br>Thank you for your payment. Your transaction has been processed successfully.",
    "facts": [
      {"label": "Transaction ID", "value": "#12345"},
      {"label": "Amount", "value": "$99.00"},
      {"label": "Date", "value": "9/27/2025"},
      {"label": "Status", "value": "Completed"}
    ],
    "cta_primary": {"label": "Download Receipt", "url": "https://app.waymore.io/receipt/12345"},
    "cta_secondary": {"label": "View Account", "url": "https://app.waymore.io/account"},
    "theme": {
      "primary_button_color": "#28a745",
      "text_color": "#2c3e50",
      "heading_color": "#1a1a1a"
    }
  }
}`,
        metadata: {
          type: 'examples',
          section: 'Payment Success',
          source: 'examples'
        }
      }
    ];

    this.chunks.push(...examples);
  }

  private async generateEmbeddings(): Promise<void> {
    console.log('Generating embeddings for documentation chunks...');
    
    let hasErrors = false;
    
    for (const chunk of this.chunks) {
      try {
        const response = await this.openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk.content
        });
        
        this.embeddings.set(chunk.id, response.data[0].embedding);
      } catch (error) {
        console.error(`Error generating embedding for chunk ${chunk.id}:`, error);
        hasErrors = true;
        
        // If it's a quota error, stop trying and throw
        if (error instanceof Error && error.message.includes('quota')) {
          throw new Error('OpenAI API quota exceeded. Vector store initialization failed.');
        }
      }
    }
    
    if (hasErrors && this.embeddings.size === 0) {
      throw new Error('Failed to generate any embeddings. Vector store initialization failed.');
    }
  }

  async search(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    try {
      // Generate embedding for the query
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query
      });
      
      const queryEmbedding = response.data[0].embedding;
      
      // Calculate similarities
      const similarities = this.chunks.map(chunk => {
        const chunkEmbedding = this.embeddings.get(chunk.id);
        if (!chunkEmbedding) return { chunk, similarity: 0 };
        
        const similarity = this.cosineSimilarity(queryEmbedding, chunkEmbedding);
        return { chunk, similarity };
      });
      
      // Sort by similarity and return top results
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => item.chunk);
        
    } catch (error) {
      console.error('Error searching vector store:', error);
      return [];
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  getChunkCount(): number {
    return this.chunks.length;
  }
}
