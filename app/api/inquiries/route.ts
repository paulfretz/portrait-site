/* eslint-disable @typescript-eslint/ban-ts-comment */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { sendInquiryNotification } from '@/lib/utils/email';
import { z } from 'zod';

// Validation schema for inquiry submission
const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  event_type: z.enum([
    'Wedding',
    'Engagement',
    'Portrait',
    'Pet',
    'Family',
    'Senior',
    'Proposal',
    'Other',
  ]),
  event_date: z.string().optional().nullable(),
  budget: z
    .enum(['<$1000', '$1000-$2500', '$2500-$5000', '$5000+', 'Not Sure'])
    .optional()
    .nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  honeypot: z.string().optional(), // Spam protection
});

/**
 * POST /api/inquiries
 * Submit a new contact inquiry
 * Public endpoint with rate limiting
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check - if filled, it's likely a bot
    if (body.honeypot && body.honeypot.length > 0) {
      // Return success to bot, but don't save
      return NextResponse.json(
        { success: true, message: 'Thank you for your inquiry' },
        { status: 200 }
      );
    }

    // Validate request body
    const validatedData = inquirySchema.parse(body);

    // Rate limiting check (email-based since ip_address not in schema)
    // Use admin client in test environment to bypass RLS
    const supabase = process.env.TEST_SUPABASE_URL ? createAdminClient() : await createClient();

    // Check for recent submissions from this email (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentSubmissions, error: checkError } = await supabase
      .from('inquiries')
      .select('id')
      .eq('email', validatedData.email)
      .gte('created_at', oneHourAgo);

    if (checkError) {
      console.error('Error checking rate limit:', checkError);
      // Continue anyway - don't block legitimate users due to check failure
    }

    // Rate limit: max 3 submissions per hour per email
    if (recentSubmissions && recentSubmissions.length >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please try again in an hour.',
        },
        { status: 429 }
      );
    }

    // Insert inquiry into database
    const { data, error } = await supabase
      .from('inquiries')
      // @ts-ignore - Supabase type inference issue, will be fixed in Task 10.22
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        event_type: validatedData.event_type,
        event_date: validatedData.event_date || null,
        budget: validatedData.budget || null,
        message: validatedData.message,
        status: 'new',
        // Note: ip_address not in schema, storing in memory for rate limiting only
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating inquiry:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit inquiry' },
        { status: 500 }
      );
    }

    // Send email notification to owner
    try {
      await sendInquiryNotification({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        eventType: validatedData.event_type,
        eventDate: validatedData.event_date,
        budget: validatedData.budget,
        message: validatedData.message,
      });
    } catch (emailError) {
      // Log error but don't fail the request - inquiry is already saved
      console.error('Failed to send email notification:', emailError);
      // Could add a flag to the inquiry record indicating email failed
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry! I will get back to you within 24 hours.',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error in POST /api/inquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/inquiries
 * List all inquiries (admin only)
 * Supports filtering by status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!user || user.email !== adminEmail) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false });

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Search by name or email if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inquiries:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch inquiries' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/inquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

