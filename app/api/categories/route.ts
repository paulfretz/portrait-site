import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getCategories,
  createCategory,
  generateSlug,
  isCategorySlugUnique,
} from '@/lib/db/queries';
import type { CategoryInsert } from '@/lib/db/types';

/**
 * GET /api/categories
 * Get all categories
 * Public endpoint - no authentication required
 *
 * @returns Array of categories ordered by display_order
 */
export async function GET() {
  try {
    const categories = await getCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category
 * Admin only - requires authentication
 *
 * Request body:
 * {
 *   name: string (required)
 *   description?: string
 *   display_order?: number
 * }
 *
 * @returns Created category
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - admin access required',
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, description, display_order } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name is required',
        },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = generateSlug(name);

    // Check if slug is unique
    const isUnique = await isCategorySlugUnique(slug);
    if (!isUnique) {
      return NextResponse.json(
        {
          success: false,
          error: 'A category with this name already exists',
        },
        { status: 409 }
      );
    }

    // Create category
    const categoryData: CategoryInsert = {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      display_order: display_order ?? 0,
    };

    const category = await createCategory(categoryData);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
      },
      { status: 500 }
    );
  }
}
