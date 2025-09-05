import { NextRequest, NextResponse } from 'next/server';

// Note: In production, you would use SendGrid, AWS SES, or similar service
// This is a mock implementation for demonstration

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Email address, subject, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Mock email sending - in production, use SendGrid or AWS SES
    console.log(`Sending email to ${to}: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock success response
    const mockResponse = {
      messageId: `msg_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      to,
      from: 'noreply@knowyourrights.app',
      subject,
      status: 'sent',
      dateSent: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockResponse
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Example of how to implement with SendGrid:
/*
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    const msg = {
      to,
      from: 'noreply@knowyourrights.app',
      subject,
      text: message,
      html: message.replace(/\n/g, '<br>')
    };

    const response = await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      data: {
        messageId: response[0].headers['x-message-id'],
        status: 'sent'
      }
    });

  } catch (error) {
    console.error('SendGrid email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
*/

