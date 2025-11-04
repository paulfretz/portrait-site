#!/usr/bin/env ts-node
/**
 * Image Quality Diagnostic Script
 * 
 * This script checks:
 * 1. What URLs are stored in the database
 * 2. What variants should exist for each image
 * 3. Whether variants are accessible
 * 4. Image dimensions and quality settings
 * 
 * Usage:
 *   npx ts-node scripts/diagnose-image-quality.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { getImageVariantUrl, generateSrcSet } from '../lib/utils/image-urls';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check if a URL is accessible and get its content length
 */
async function checkUrl(url: string): Promise<{ exists: boolean; size?: number; status?: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return {
      exists: response.ok,
      size: contentLength ? parseInt(contentLength, 10) : undefined,
      status: response.status,
    };
  } catch (error) {
    return { exists: false, status: 0 };
  }
}

/**
 * Main diagnostic function
 */
async function diagnoseImageQuality() {
  console.log('🔍 Image Quality Diagnostic Tool\n');
  console.log('=' .repeat(60));
  
  // 1. Get images from database
  console.log('\n1️⃣ Fetching images from database...');
  const { data: images, error } = await supabase
    .from('images')
    .select('id, url, width, height, gallery_id')
    .limit(10);
  
  if (error) {
    console.error('❌ Error fetching images:', error);
    process.exit(1);
  }
  
  if (!images || images.length === 0) {
    console.log('⚠️  No images found in database');
    process.exit(0);
  }
  
  console.log(`✅ Found ${images.length} images\n`);
  
  // 2. Analyze each image
  for (let i = 0; i < Math.min(images.length, 5); i++) {
    const image = images[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📸 Image ${i + 1}: ${image.id}`);
    console.log(`   Dimensions: ${image.width} × ${image.height}`);
    console.log(`   Original URL: ${image.url}`);
    
    // Check original URL format
    const urlPattern = /-original\.(jpeg|jpg|webp)/i;
    const isOriginalFormat = urlPattern.test(image.url);
    const hasRandomSuffix = /-[a-z0-9]{8,}\?/.test(image.url) || image.url.includes('?');
    console.log(`   ✅ URL format: ${isOriginalFormat ? 'Correct (-original.jpeg)' : '❌ UNEXPECTED FORMAT'}`);
    console.log(`   ${hasRandomSuffix ? '⚠️  WARNING: URL has random suffix - variant URLs may not work!' : '✅ No random suffix'}`);
    
    // 3. Generate expected variant URLs
    console.log(`\n2️⃣ Expected Variants:`);
    const variants = [
      { name: 'thumbnail', width: 400 },
      { name: 'medium', width: 1200 },
      { name: 'large', width: 2400 },
      { name: 'xlarge', width: 4000 },
      { name: 'original', width: null },
    ];
    
    const variantChecks: Array<{
      name: string;
      webpUrl: string;
      jpegUrl: string;
      webpExists: boolean;
      jpegExists: boolean;
      webpSize?: number;
      jpegSize?: number;
    }> = [];
    
    for (const variant of variants) {
      const webpUrl = getImageVariantUrl(image.url, variant.name as any, 'webp');
      const jpegUrl = getImageVariantUrl(image.url, variant.name as any, 'jpeg');
      
      console.log(`\n   ${variant.name} (${variant.width || 'original'}px):`);
      console.log(`     WebP: ${webpUrl}`);
      console.log(`     JPEG: ${jpegUrl}`);
      
      // Check if URLs exist
      const [webpCheck, jpegCheck] = await Promise.all([
        checkUrl(webpUrl),
        checkUrl(jpegUrl),
      ]);
      
      const webpSizeMB = webpCheck.size ? (webpCheck.size / 1024 / 1024).toFixed(2) : 'N/A';
      const jpegSizeMB = jpegCheck.size ? (jpegCheck.size / 1024 / 1024).toFixed(2) : 'N/A';
      
      console.log(`     WebP: ${webpCheck.exists ? '✅ EXISTS' : '❌ MISSING'} (${webpSizeMB}MB, status: ${webpCheck.status || 'N/A'})`);
      console.log(`     JPEG: ${jpegCheck.exists ? '✅ EXISTS' : '❌ MISSING'} (${jpegSizeMB}MB, status: ${jpegCheck.status || 'N/A'})`);
      
      variantChecks.push({
        name: variant.name,
        webpUrl,
        jpegUrl,
        webpExists: webpCheck.exists,
        jpegExists: jpegCheck.exists,
        webpSize: webpCheck.size,
        jpegSize: jpegCheck.size,
      });
    }
    
    // 4. Generate srcset for gallery grid
    console.log(`\n3️⃣ Generated SrcSet for Gallery Grid:`);
    const srcset = generateSrcSet(image.url, false);
    console.log(`   ${srcset}`);
    
    // 5. Check if original image dimensions match expected
    console.log(`\n4️⃣ Image Quality Analysis:`);
    if (image.width && image.height) {
      const isHighRes = image.width >= 4000 || image.height >= 4000;
      console.log(`   Original: ${image.width} × ${image.height} ${isHighRes ? '✅ High-res' : '⚠️  Lower res'}`);
      
      // Check if xlarge variant should exist
      const shouldHaveXlarge = image.width >= 4000 || image.height >= 4000;
      const xlargeExists = variantChecks.find(v => v.name === 'xlarge')?.webpExists || false;
      
      if (shouldHaveXlarge && !xlargeExists) {
        console.log(`   ⚠️  WARNING: Image is high-res but xlarge variant is missing!`);
      }
    }
    
    // 6. Summary for this image
    console.log(`\n5️⃣ Summary:`);
    const missingVariants = variantChecks.filter(v => !v.webpExists && !v.jpegExists);
    if (missingVariants.length > 0) {
      console.log(`   ❌ Missing variants: ${missingVariants.map(v => v.name).join(', ')}`);
    } else {
      console.log(`   ✅ All variants exist`);
    }
    
    // Check file sizes
    const originalSize = variantChecks.find(v => v.name === 'original')?.jpegSize || 0;
    const largeSize = variantChecks.find(v => v.name === 'large')?.jpegSize || 0;
    const xlargeSize = variantChecks.find(v => v.name === 'xlarge')?.jpegSize || 0;
    
    if (originalSize > 0) {
      console.log(`   Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
      if (largeSize > 0) {
        const compressionRatio = ((1 - largeSize / originalSize) * 100).toFixed(1);
        console.log(`   Large variant: ${(largeSize / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% compression)`);
      }
      if (xlargeSize > 0) {
        const compressionRatio = ((1 - xlargeSize / originalSize) * 100).toFixed(1);
        console.log(`   XLarge variant: ${(xlargeSize / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% compression)`);
      }
    }
  }
  
  // 7. Overall recommendations
  console.log(`\n${'='.repeat(60)}`);
  console.log(`\n💡 Recommendations:`);
  console.log(`\n1. Check upload pipeline:`);
  console.log(`   - Verify images are being processed through image-optimizer.ts`);
  console.log(`   - Check that all variants are being uploaded to Vercel Blob`);
  console.log(`   - Verify upload API route is using correct Sharp settings\n`);
  
  console.log(`2. Check URL generation:`);
  console.log(`   - Verify getImageVariantUrl() is generating correct URLs`);
  console.log(`   - Check that URLs match actual file names in Vercel Blob\n`);
  
  console.log(`3. Check browser behavior:`);
  console.log(`   - Open DevTools → Network tab`);
  console.log(`   - Filter by "Img"`);
  console.log(`   - Verify requests go to direct blob URLs, not /_next/image proxy`);
  console.log(`   - Check naturalWidth vs clientWidth × DPR\n`);
  
  console.log(`4. Next steps:`);
  console.log(`   - If variants are missing: Re-upload images or check upload pipeline`);
  console.log(`   - If URLs have random suffixes: This breaks variant URL generation! Fix upload route.`);
  console.log(`   - If URLs are wrong: Fix getImageVariantUrl() or database URLs`);
  console.log(`   - If Next.js is optimizing: Consider using native <img> with srcset\n`);
  
  console.log(`🔴 CRITICAL ISSUE DETECTED:`);
  console.log(`   If URLs have random suffixes (from addRandomSuffix: true),`);
  console.log(`   getImageVariantUrl() cannot reconstruct variant URLs correctly!\n`);
}

// Run the diagnostic
diagnoseImageQuality().catch(console.error);

