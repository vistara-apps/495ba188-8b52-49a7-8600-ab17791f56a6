import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const { scenario, language = 'en', jurisdiction } = await request.json();

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate de-escalation scripts for the following police interaction scenario: "${scenario}"
    
    Please provide the response in ${language === 'es' ? 'Spanish' : 'English'} and format it as JSON:
    {
      "scenario": "${scenario}",
      "language": "${language}",
      "scripts": [
        {
          "situation": "Specific situation within the scenario",
          "response": "Exact words to say",
          "tone": "calm|assertive|cooperative"
        }
      ]
    }

    Guidelines:
    - Provide 5-8 different situations within this scenario
    - Focus on de-escalation and safety
    - Use respectful, clear language
    - Include responses for different officer attitudes
    - Consider ${jurisdiction} specific context if provided
    - Prioritize constitutional rights while maintaining safety
    - Include phrases that assert rights without being confrontational

    Make responses practical and easy to remember under stress.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in de-escalation techniques and civil rights. Generate helpful, safe, and legally sound scripts for police interactions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    let scripts;
    try {
      scripts = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scripts = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...scripts,
        generatedAt: new Date().toISOString(),
        isPremium: false, // Mark as free for now
      }
    });

  } catch (error) {
    console.error('Error generating scripts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate scripts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
