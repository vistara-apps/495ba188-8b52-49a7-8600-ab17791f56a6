import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const { jurisdiction, language = 'en' } = await request.json();

    if (!jurisdiction) {
      return NextResponse.json(
        { error: 'Jurisdiction is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a comprehensive legal rights card for police interactions in ${jurisdiction}. 
    
    Please provide the response in ${language === 'es' ? 'Spanish' : 'English'} and format it as JSON with the following structure:
    {
      "dos": ["array of things you SHOULD do"],
      "donts": ["array of things you should NOT do"],
      "keyRights": ["array of fundamental rights"],
      "importantNumbers": [
        {
          "name": "Organization name",
          "number": "phone number",
          "description": "what they help with"
        }
      ],
      "specificLaws": [
        {
          "title": "Law title",
          "description": "Brief description",
          "reference": "Legal reference"
        }
      ]
    }

    Focus on:
    - Practical, actionable advice
    - State-specific laws and procedures
    - De-escalation techniques
    - Constitutional rights
    - Local legal aid resources
    - Emergency contacts specific to the area

    Make it mobile-friendly and easy to understand under stress.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert specializing in civil rights and police interaction law. Provide accurate, helpful, and jurisdiction-specific legal information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    let legalRights;
    try {
      legalRights = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        legalRights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        jurisdiction,
        language,
        content: legalRights,
        generatedAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error generating legal card:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate legal card',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
