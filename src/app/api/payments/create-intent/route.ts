import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { paymentService } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { 
      amount, 
      currency = 'usd',
      productType,
      userId,
      metadata = {}
    } = await request.json();

    if (!amount || !productType || !userId) {
      return NextResponse.json(
        { error: 'Amount, product type, and user ID are required' },
        { status: 400 }
      );
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId,
        productType,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save transaction to database
    const transaction = await paymentService.create({
      userId,
      amount,
      currency: currency.toUpperCase() as 'USD',
      type: 'stripe',
      status: 'pending',
      productType: productType as any,
      transactionHash: paymentIntent.id
    });

    if (!transaction) {
      throw new Error('Failed to save transaction');
    }

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        transactionId: transaction.id
      }
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

