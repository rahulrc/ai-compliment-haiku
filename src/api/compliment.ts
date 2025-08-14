export interface ComplimentRequest {
  name?: string
  relationship: string
  context: string[]
  style: 'classic' | 'goofy' | 'poetic' | 'professional'
  specificity: number
  type?: 'compliment' | 'haiku'
}

export interface ComplimentResponse {
  compliment: string
  sparkleScore: number
  tags: string[]
}

// Secure API function - calls our backend instead of OpenAI directly
export async function generateCompliment(request: ComplimentRequest): Promise<ComplimentResponse> {
  try {
    // Call our secure backend API
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    return data

  } catch (error) {
    console.error('API Error:', error)
    
    // Fallback to mock responses if API fails
    if (request.type === 'haiku') {
      return {
        compliment: `Gentle morning light\nWarms the heart with kindness bright\nJoy takes gentle flight`,
        sparkleScore: 4,
        tags: ['haiku', request.style, 'fallback']
      }
    }
    
    return {
      compliment: `Your ${request.style} nature brings warmth to every ${request.relationship} interaction. Your attention to detail and thoughtful approach make you truly special.`,
      sparkleScore: 4,
      tags: [request.style, 'fallback']
    }
  }
}
