/* eslint-disable @typescript-eslint/ban-ts-comment */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'booked', 'archived']),
});

/**
 * PUT /api/inquiries/[id]
 * Update inquiry status (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!user || user.email !== adminEmail) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = updateSchema.parse(body);

    // Update inquiry
    const { data, error } = await supabase
      .from('inquiries')
      // @ts-ignore - Supabase type inference issue
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inquiry:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update inquiry' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
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

    console.error('Error in PUT /api/inquiries/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/inquiries/[id]
 * Get single inquiry (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!user || user.email !== adminEmail) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching inquiry:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch inquiry' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/inquiries/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

