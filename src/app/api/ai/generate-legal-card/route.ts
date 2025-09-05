import { NextRequest, NextResponse } from 'next/server';
import { generateLegalCard } from '@/lib/openai';
import { legalCardService } from '@/lib/supabase';
import type { Jurisdiction } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { jurisdiction, language = 'en', forceRefresh = false } = await request.json();

    if (!jurisdiction) {
      return NextResponse.json(
        { error: 'Jurisdiction is required' },
        { status: 400 }
      );
    }

    // Check if we have cached content and don't need to refresh
    if (!forceRefresh) {
      const existingContent = await legalCardService.getByJurisdiction(jurisdiction);
      if (existingContent) {
        return NextResponse.json({
          success: true,
          data: existingContent
        });
      }
    }

    // Generate new legal card content
    const contentJson = await generateLegalCard(jurisdiction as Jurisdiction, language);
    
    // Save to database
    const legalCard = await legalCardService.create({
      jurisdiction,
      title: `Legal Rights - ${jurisdiction.replace('_', ' ').toUpperCase()}`,
      contentJson,
      version: '1.0',
      isVerified: false // Would be true after legal review
    });

    if (!legalCard) {
      throw new Error('Failed to save legal card content');
    }

    return NextResponse.json({
      success: true,
      data: legalCard
    });

  } catch (error) {
    console.error('Legal card generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate legal card',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

