import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  generateSlug,
  isCategorySlugUnique,
} from '@/lib/db/queries';
import type { Category } from '@/lib/db/types';

type Params = {
  params: {
    id: string;
  };
};

/**
 * GET /api/categories/[id]
 * Get a single category by ID or slug
 * Public endpoint - no authentication required
 *
 * @returns Category data
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Try to get category by slug first (more common use case)
    let category = await getCategoryBySlug(id);

    // If not found by slug, try by ID
    if (!category) {
      const supabase = await createClient();
      const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            {
              success: false,
              error: 'Category not found',
            },
            { status: 404 }
          );
        }
        throw error;
      }

      category = data;
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/[id]
 * Update a category
 * Admin only - requires authentication
 *
 * Request body:
 * {
 *   name?: string
 *   description?: string
 *   display_order?: number
 * }
 *
 * @returns Updated category
 */
export async function PUT(request: NextRequest, { params }: Params) {
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

    const { id } = params;

    // Parse request body
    const body = await request.json();
    const { name, description, display_order } = body;

    // Build updates object
    const updates: Partial<Category> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Name must be a non-empty string',
          },
          { status: 400 }
        );
      }

      updates.name = name.trim();

      // Generate new slug
      const newSlug = generateSlug(name);

      // Check if new slug is unique (excluding current category)
      const isUnique = await isCategorySlugUnique(newSlug, id);
      if (!isUnique) {
        return NextResponse.json(
          {
            success: false,
            error: 'A category with this name already exists',
          },
          { status: 409 }
        );
      }

      updates.slug = newSlug;
    }

    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    if (display_order !== undefined) {
      if (typeof display_order !== 'number') {
        return NextResponse.json(
          {
            success: false,
            error: 'Display order must be a number',
          },
          { status: 400 }
        );
      }
      updates.display_order = display_order;
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid fields to update',
        },
        { status: 400 }
      );
    }

    // Update category
    const category = await updateCategory(id, updates);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update category',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category
 * Admin only - requires authentication
 * WARNING: This cascades to all galleries and images in the category
 *
 * @returns Success message
 */
export async function DELETE(request: NextRequest, { params }: Params) {
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

    const { id } = params;

    // Delete category (cascades to galleries and images)
    await deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete category',
      },
      { status: 500 }
    );
  }
}
