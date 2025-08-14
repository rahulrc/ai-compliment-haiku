module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { relationship, context, style, specificity, type, name } = req.body

    // Validate required fields
    if (!relationship || !context || !style || !specificity || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get API key from server environment (secure)
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' })
    }

    // Prepare the prompt
    const systemPrompt = type === 'haiku' 
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

IMPORTANT: Return ONLY raw JSON without any markdown formatting, code blocks, or extra text.

Return exactly this format:
{
  "compliment": "Your haiku text here\\nwith proper line breaks",
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

IMPORTANT: Return ONLY raw JSON without any markdown formatting, code blocks, or extra text.

Return exactly this format:
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

    const userPrompt = type === 'haiku'
      ? `Generate a ${style} haiku for a ${relationship} with specificity level ${specificity}.

Context: ${context.join(', ')}
${name ? `Name: ${name}` : 'No specific name provided'}

Please ensure the haiku follows the 5-7-5 syllable pattern and matches the style and specificity level requested.`
      : `Generate a ${style} compliment for a ${relationship} with specificity level ${specificity}.

Context: ${context.join(', ')}
${name ? `Name: ${name}` : 'No specific name provided'}

Please ensure the compliment matches the style and specificity level requested.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Parse the JSON response
    let parsedContent
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim()
      
      // Remove markdown code block formatting (```json ... ```)
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      parsedContent = JSON.parse(cleanContent)
    } catch (parseError) {
      // If parsing fails, create a fallback response
      parsedContent = {
        compliment: content,
        sparkleScore: 3,
        tags: [type, style]
      }
    }

    // Return the response
    res.status(200).json(parsedContent)

  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
