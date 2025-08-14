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

// Extend ImportMeta interface for Vite environment variables
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_GPT_5_API_KEY: string
    }
  }
}

// Real GPT-5 API function
export async function generateCompliment(request: ComplimentRequest): Promise<ComplimentResponse> {
  try {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_GPT_5_API_KEY
    
    // Debug logging (remove this after fixing)
    console.log('API Key check:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      envVars: Object.keys(import.meta.env).filter(key => key.includes('GPT'))
    })
    
    if (!apiKey) {
      throw new Error('GPT-5 API key not found. Please set VITE_GPT_5_API_KEY in your environment variables.')
    }

    // Prepare the prompt for GPT-5
    const systemPrompt = request.type === 'haiku' 
      ? `You are a G-rated haiku generator. Create beautiful, meaningful haikus that follow the traditional Japanese 5-7-5 syllable structure (17 total syllables) in three lines.

Haiku Rules:
- First line: exactly 5 syllables
- Second line: exactly 7 syllables  
- Third line: exactly 5 syllables
- Total: exactly 17 syllables
- Use natural, flowing language
- Capture a moment or feeling
- Be positive and uplifting
- Avoid sensitive topics
- Make specificity level 1-2 more general, 4-5 more contextual

Styles:
- Classic: Warm, sincere, universally positive
- Goofy: Playful, fun, lighthearted
- Poetic: Elegant, artistic, metaphorical
- Professional: Polished, formal, workplace-appropriate

Always return valid JSON with exactly this format:
{
  "compliment": "Your haiku text here\nwith proper line breaks",
  "sparkleScore": 3,
  "tags": ["haiku", "style", "contextual_tag"]
}

CRITICAL: The haiku MUST follow the 5-7-5 syllable pattern exactly:
- Line 1: exactly 5 syllables
- Line 2: exactly 7 syllables  
- Line 3: exactly 5 syllables
- Total: exactly 17 syllables

Count syllables carefully and ensure each line meets the exact requirement.`
      : `You are a G-rated compliment generator. Create short, delightful compliments (max 280 characters) that avoid sensitive topics and are always positive and uplifting.

Styles:
- Classic: Warm, sincere, universally positive, no emojis
- Goofy: Playful, fun, can include 1-2 emojis, lighthearted
- Poetic: Elegant, artistic, metaphorical, no emojis
- Professional: Polished, formal, workplace-appropriate, no emojis

Specificity levels:
- 1: General, universal praise
- 2: Lightly contextual, some personal touches
- 3: Balanced mix of general and specific
- 4: Heavily contextual, very personalized
- 5: Highly tailored to the specific context provided

Always return valid JSON with exactly this format:
{
  "compliment": "Your actual compliment text here",
  "sparkleScore": 3,
  "tags": ["style", "contextual_tag"]
}

Rules:
- Keep compliments under 280 characters
- Only use emojis in Goofy style
- Avoid appearance/body comments unless explicitly in context
- Make specificity level 1-2 more general, 4-5 more contextual
- Include relevant tags like "work", "team", "helpful", "creative", etc.
- Sparkle score should be 1-5 based on how delightful the compliment is`

    const userPrompt = request.type === 'haiku'
      ? `Generate a ${request.style} haiku for a ${request.relationship} with specificity level ${request.specificity}.

Context: ${request.context.join(', ')}
${request.name ? `Name: ${request.name}` : 'No specific name provided'}

Please ensure the haiku follows the 5-7-5 syllable pattern and matches the style and specificity level requested.`
      : `Generate a ${request.style} compliment for a ${request.relationship} with specificity level ${request.specificity}.

Context: ${request.context.join(', ')}
${request.name ? `Name: ${request.name}` : 'No specific name provided'}

Please ensure the compliment matches the style and specificity level requested.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4o as GPT-5 is not yet available
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('Invalid API response format')
    }

    // Parse the JSON response
    let parsed: ComplimentResponse
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      throw new Error('Failed to parse API response as JSON')
    }

    // Validate the response
    if (!parsed.compliment || typeof parsed.compliment !== 'string') {
      throw new Error('Invalid compliment text in response')
    }

    if (parsed.compliment.length > 280) {
      throw new Error('Generated compliment is too long')
    }

    // Validate sparkle score
    if (typeof parsed.sparkleScore !== 'number' || parsed.sparkleScore < 1 || parsed.sparkleScore > 5) {
      parsed.sparkleScore = 3 // Default fallback
    }

    // Validate tags
    if (!Array.isArray(parsed.tags)) {
      parsed.tags = [request.style]
    }

    // Ensure style tag is included
    if (!parsed.tags.includes(request.style)) {
      parsed.tags.unshift(request.style)
    }

    return {
      compliment: parsed.compliment,
      sparkleScore: parsed.sparkleScore,
      tags: parsed.tags
    }

  } catch (error) {
    console.error('GPT-5 API error:', error)
    
    // Fallback to mock responses if API fails
    console.warn('Falling back to mock responses due to API error')
    
    if (request.type === 'haiku') {
      const mockHaikus = {
        classic: [
          "Gentle morning light\nShines through your kind actions now\nWarming every heart",
          "Steady as a rock\nYour support never falters\nStrength in quiet ways",
          "Like a gentle breeze\nYour presence brings fresh insight\nTo every moment"
        ],
        goofy: [
          "Sparkles in your eyes\nJoy bubbles up like soda\nPop! There goes my heart ✨",
          "Giggle like a stream\nFlowing through the workday bright\nSplash! Fun everywhere",
          "Bounce like a bunny\nEnergy that never stops\nHop! Skip! Jump! Yay! 🐰"
        ],
        poetic: [
          "Petals fall like words\nEach syllable a blessing\nPoetry in motion",
          "Moonlight on still water\nReflects your inner beauty\nRipples of kindness",
          "Mountains touch the sky\nYour spirit reaches higher still\nEagles soar with you"
        ],
        professional: [
          "Precision in thought\nLeads to excellence achieved\nMastery displayed",
          "Collaboration flows\nLike rivers joining oceans\nStrength in unity",
          "Innovation sparks\nFrom your creative mind\nFuture takes shape"
        ]
      }
      
      const haikus = mockHaikus[request.style]
      const randomHaiku = haikus[Math.floor(Math.random() * haikus.length)]
      
      const tags = ['haiku', request.style]
      if (request.context.some(c => c.toLowerCase().includes('work'))) tags.push('work')
      if (request.context.some(c => c.toLowerCase().includes('team'))) tags.push('team')
      
      return {
        compliment: randomHaiku,
        sparkleScore: 4,
        tags
      }
    }
    
    const mockResponses = {
      classic: [
        "Your dedication to helping others never goes unnoticed. You have a way of making complex things feel simple.",
        "Thanks for being the kind of person who always shows up when it matters most.",
        "Your positive attitude is contagious and makes every interaction better."
      ],
      goofy: [
        "You're like a human ray of sunshine with extra sparkles! ✨",
        "If there was a championship for being awesome, you'd win it every time! 🏆",
        "Your energy is so infectious, I'm pretty sure you could cheer up a grumpy cat! 😸"
      ],
      poetic: [
        "Like morning light breaking through clouds, your presence brings clarity to confusion.",
        "You weave words into bridges that connect hearts and minds across distances.",
        "Your kindness flows like a gentle stream, nourishing the soil of every relationship."
      ],
      professional: [
        "Your strategic thinking and attention to detail consistently deliver exceptional results.",
        "The way you approach challenges with both creativity and precision sets a high standard for excellence.",
        "Your professional integrity and collaborative spirit create an environment where everyone can thrive."
      ]
    }

    const responses = mockResponses[request.style]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    const tags: string[] = [request.style]
    if (request.context.some(c => c.toLowerCase().includes('work'))) tags.push('work')
    if (request.context.some(c => c.toLowerCase().includes('team'))) tags.push('team')
    
    return {
      compliment: randomResponse,
      sparkleScore: 3,
      tags
    }
  }
}

// Real API implementation would look like this:
/*
export async function generateCompliment(request: ComplimentRequest): Promise<ComplimentResponse> {
  const response = await fetch('/api/compliment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GPT_5_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: `You are a G-rated compliment generator. Create short, delightful compliments (max 280 characters) that avoid sensitive topics. 
          
          Styles:
          - Classic: Warm, sincere, universally positive
          - Goofy: Playful, fun, can include 1 emoji
          - Poetic: Elegant, artistic, metaphorical
          - Professional: Polished, formal, workplace-appropriate
          
          Specificity levels:
          - 1: General, universal
          - 2: Lightly contextual
          - 3: Balanced mix
          - 4: Heavily contextual
          - 5: Highly tailored to context
          
          Always return valid JSON with: compliment (string), sparkleScore (1-5), tags (array of relevant tags)`
        },
        {
          role: 'user',
          content: `Generate a ${request.style} compliment for a ${request.relationship} with specificity level ${request.specificity}. Context: ${request.context.join(', ')}${request.name ? ` Name: ${request.name}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const data = await response.json()
  
  // Parse and validate response
  const compliment = data.choices[0]?.message?.content
  if (!compliment) {
    throw new Error('Invalid API response format')
  }

  try {
    const parsed = JSON.parse(compliment)
    return {
      compliment: parsed.compliment,
      sparkleScore: Math.min(5, Math.max(1, parsed.sparkleScore || 3)),
      tags: Array.isArray(parsed.tags) ? parsed.tags : [request.style]
    }
  } catch {
    // Fallback if JSON parsing fails
    return {
      compliment: compliment.replace(/^["\s]+|["\s]+$/g, ''),
      sparkleScore: 3,
      tags: [request.style]
    }
  }
}
*/
