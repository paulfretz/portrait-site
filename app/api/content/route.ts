import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, getPageContents, upsertPageContent } from '@/lib/db/queries';
import type { PageContentInsert, ContentType } from '@/lib/db/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/content
 * Get page content
 * Public endpoint - no authentication required
 *
 * Query parameters:
 * - page: Page identifier (required) - e.g., 'home', 'about', 'contact'
 * - section: Section identifier (optional) - e.g., 'bio', 'hero_headline'
 *
 * If section is provided: returns single content item
 * If section is omitted: returns all content for the page
 *
 * Examples:
 * - /api/content?page=about&section=bio
 * - /api/content?page=home (returns all home page content)
 *
 * @returns Page content data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    // Validate required page parameter
    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: 'Page parameter is required',
        },
        { status: 400 }
      );
    }

    // If section provided, get specific content
    if (section) {
      const content = await getPageContent(page, section);

      if (!content) {
        return NextResponse.json(
          {
            success: false,
            error: 'Content not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: content,
      });
    }

    // Otherwise get all content for the page
    const contents = await getPageContents(page);

    return NextResponse.json({
      success: true,
      data: contents,
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch page content',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content
 * Update or create page content (upsert)
 * Admin only - requires authentication
 * Used for inline editing of page content
 *
 * Request body:
 * {
 *   page: string (required) - e.g., 'home', 'about', 'contact'
 *   section: string (required) - e.g., 'bio', 'hero_headline'
 *   content: string (required) - the actual content
 *   content_type?: 'text' | 'html' | 'markdown' | 'json' (optional, defaults to 'text')
 * }
 *
 * If content exists for (page, section), it will be updated
 * If it doesn't exist, it will be created
 *
 * @returns Updated or created content
 */
export async function PUT(request: NextRequest) {
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
    const { page, section, content, content_type } = body;

    // Validate required fields
    if (!page || typeof page !== 'string' || page.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Page is required and must be a non-empty string',
        },
        { status: 400 }
      );
    }

    if (!section || typeof section !== 'string' || section.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Section is required and must be a non-empty string',
        },
        { status: 400 }
      );
    }

    if (content === undefined || content === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content is required',
        },
        { status: 400 }
      );
    }

    if (typeof content !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Content must be a string',
        },
        { status: 400 }
      );
    }

    // Validate content_type if provided
    const validContentTypes: ContentType[] = ['text', 'html', 'markdown', 'json'];
    const finalContentType = content_type || 'text';

    if (!validContentTypes.includes(finalContentType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid content_type. Must be one of: ${validContentTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Upsert page content (update if exists, create if not)
    const contentData: PageContentInsert = {
      page: page.trim(),
      section: section.trim(),
      content,
      content_type: finalContentType,
    };

    const updatedContent = await upsertPageContent(contentData);

    return NextResponse.json({
      success: true,
      data: updatedContent,
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update page content',
      },
      { status: 500 }
    );
  }
}
