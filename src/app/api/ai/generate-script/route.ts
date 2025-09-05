import { NextRequest, NextResponse } from 'next/server';
import { generateDeescalationScript } from '@/lib/openai';
import type { InteractionScenario } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { 
      scenario, 
      language = 'en', 
      isPremium = false,
      userId 
    } = await request.json();

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario is required' },
        { status: 400 }
      );
    }

    // Check if user has premium access for premium scripts
    if (isPremium) {
      // In a real app, you'd check the user's subscription status
      // For now, we'll allow premium scripts for demo purposes
      console.log(`Generating premium script for user: ${userId}`);
    }

    // Generate de-escalation script
    const script = await generateDeescalationScript(
      scenario as InteractionScenario,
      language,
      isPremium
    );

    return NextResponse.json({
      success: true,
      data: script
    });

  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate script',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

