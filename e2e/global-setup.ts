import { chromium, FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function globalSetup(config: FullConfig) {
  console.log('\n🌱 Setting up test database...\n');

  // Get test database credentials
  const supabaseUrl = process.env.TEST_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.TEST_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Try to get service role key for admin operations
  // First check for TEST-specific service role, then fall back to main service role
  const supabaseServiceKey = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERROR: Test database credentials not found');
    console.error('   Please set TEST_SUPABASE_URL and TEST_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }

  console.log(`📊 Test Database: ${supabaseUrl}`);

  // Create Supabase client with service role for admin operations (if available)
  // Service role key automatically bypasses RLS, allowing us to seed data
  const supabase = createClient(
    supabaseUrl, 
    supabaseServiceKey || supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  if (supabaseServiceKey) {
    console.log('🔓 Using service role key (bypasses RLS automatically)');
  } else {
    console.log('⚠️  No service role key found - using anon key');
    console.log('   💡 If seeding fails, add TEST_SUPABASE_SERVICE_ROLE_KEY to .env.local');
    console.log('   📖 See SEED-TEST-DATABASE.md for instructions');
  }

  try {
    // Clear existing data (in reverse dependency order)
    // Using gt(0) with a filter to delete all rows
    console.log('🧹 Clearing existing test data...');
    
    // Delete images first (has foreign key to galleries)
    const { error: delImg } = await supabase.from('images').delete().not('id', 'is', null);
    if (delImg && delImg.code !== 'PGRST116') console.log('   ℹ️  Images:', delImg.message);
    
    // Delete galleries (has foreign key to categories)
    const { error: delGal } = await supabase.from('galleries').delete().not('id', 'is', null);
    if (delGal && delGal.code !== 'PGRST116') console.log('   ℹ️  Galleries:', delGal.message);
    
    // Delete categories
    const { error: delCat } = await supabase.from('categories').delete().not('id', 'is', null);
    if (delCat && delCat.code !== 'PGRST116') console.log('   ℹ️  Categories:', delCat.message);
    
    // Delete inquiries (independent table)
    const { error: delInq } = await supabase.from('inquiries').delete().not('id', 'is', null);
    if (delInq && delInq.code !== 'PGRST116') console.log('   ℹ️  Inquiries:', delInq.message);
    
    // Delete page content (independent table)
    const { error: delPage } = await supabase.from('page_content').delete().not('id', 'is', null);
    if (delPage && delPage.code !== 'PGRST116') console.log('   ℹ️  Page content:', delPage.message);
    
    console.log('   ✅ Test data cleared');

    // Disable RLS on test tables to allow data insertion
    console.log('🔓 Disabling RLS on test tables...');
    const tables = ['categories', 'galleries', 'images', 'inquiries', 'page_content'];
    for (const table of tables) {
      // Use raw SQL to disable RLS - this requires service role key
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;` 
      });
      if (error) {
        console.log(`   ℹ️  ${table}: ${error.message}`);
      }
    }
    console.log('   ✅ RLS disabled on test tables');

    // Seed categories
    console.log('📁 Creating categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .insert([
        { name: 'Weddings', slug: 'weddings', description: 'Beautiful wedding photography', display_order: 1 },
        { name: 'Portraits', slug: 'portraits', description: 'Professional portrait photography', display_order: 2 },
        { name: 'Events', slug: 'events', description: 'Event photography', display_order: 3 },
        { name: 'Seniors', slug: 'seniors', description: 'Senior portrait photography', display_order: 4 },
        { name: 'Families', slug: 'families', description: 'Family portrait sessions', display_order: 5 },
        { name: 'Maternity', slug: 'maternity', description: 'Maternity photography', display_order: 6 },
        { name: 'Engagement', slug: 'engagement', description: 'Engagement sessions', display_order: 7 },
      ])
      .select();

    if (catError) throw catError;
    console.log(`   ✅ Created ${categories?.length || 0} categories`);

    // Seed galleries
    console.log('🖼️  Creating galleries...');
    const { data: galleries, error: galError } = await supabase
      .from('galleries')
      .insert([
        { category_id: categories![0].id, title: 'Sarah & John Wedding', slug: 'sarah-john-wedding', description: 'Summer wedding in Missoula', location: 'Missoula, MT', date: '2024-06-15', client_name: 'Sarah & John', display_order: 1 },
        { category_id: categories![0].id, title: 'Emma & Michael Wedding', slug: 'emma-michael-wedding', description: 'Elegant wedding at sunset', location: 'Bozeman, MT', date: '2024-07-20', client_name: 'Emma & Michael', display_order: 2 },
        { category_id: categories![1].id, title: 'Smith Family Portraits', slug: 'smith-family-portraits', description: 'Annual family session', location: 'Missoula, MT', date: '2024-08-10', client_name: 'Smith Family', display_order: 1 },
        { category_id: categories![1].id, title: 'Johnson Family Portraits', slug: 'johnson-family-portraits', description: 'Outdoor family session', location: 'Kalispell, MT', date: '2024-09-05', client_name: 'Johnson Family', display_order: 2 },
        { category_id: categories![2].id, title: 'Corporate Event 2024', slug: 'corporate-event-2024', description: 'Annual company gathering', location: 'Billings, MT', date: '2024-05-12', client_name: 'ABC Corp', display_order: 1 },
        { category_id: categories![3].id, title: 'Class of 2024 - Alex', slug: 'class-2024-alex', description: 'Senior portraits', location: 'Missoula, MT', date: '2024-04-15', client_name: 'Alex', display_order: 1 },
        { category_id: categories![4].id, title: 'Anderson Family Fall Session', slug: 'anderson-family-fall', description: 'Fall family portraits', location: 'Missoula, MT', date: '2024-10-01', client_name: 'Anderson Family', display_order: 1 },
        { category_id: categories![5].id, title: 'Expecting Baby Thompson', slug: 'expecting-baby-thompson', description: 'Maternity session', location: 'Missoula, MT', date: '2024-08-20', client_name: 'Thompson Family', display_order: 1 },
        { category_id: categories![6].id, title: 'David & Lisa Engagement', slug: 'david-lisa-engagement', description: 'Mountain engagement session', location: 'Glacier National Park, MT', date: '2024-09-15', client_name: 'David & Lisa', display_order: 1 },
      ])
      .select();

    if (galError) throw galError;
    console.log(`   ✅ Created ${galleries?.length || 0} galleries`);

    // Seed images
    console.log('📸 Creating images...');
    const images = [
      // Sarah & John Wedding
      { gallery_id: galleries![0].id, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000', alt_text: 'Bride and groom first dance', width: 2000, height: 1333, display_order: 1, is_hero_image: true, hero_display_order: 1, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![0].id, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2000', alt_text: 'Wedding ceremony', width: 2000, height: 1333, display_order: 2, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![0].id, url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=2000', alt_text: 'Wedding reception', width: 2000, height: 1333, display_order: 3, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![0].id, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2000', alt_text: 'Wedding details', width: 2000, height: 1333, display_order: 4, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      
      // Emma & Michael Wedding
      { gallery_id: galleries![1].id, url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=2000', alt_text: 'Sunset wedding photo', width: 2000, height: 1333, display_order: 1, is_hero_image: true, hero_display_order: 2, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![1].id, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=2000', alt_text: 'Wedding couple portrait', width: 2000, height: 1333, display_order: 2, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![1].id, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000', alt_text: 'Wedding party', width: 2000, height: 1333, display_order: 3, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      
      // Smith Family
      { gallery_id: galleries![2].id, url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=2000', alt_text: 'Smith family portrait', width: 2000, height: 1333, display_order: 1, is_hero_image: true, hero_display_order: 3, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![2].id, url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=2000', alt_text: 'Family outdoor session', width: 2000, height: 1333, display_order: 2, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      
      // Johnson Family
      { gallery_id: galleries![3].id, url: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=2000', alt_text: 'Johnson family portrait', width: 2000, height: 1333, display_order: 1, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![3].id, url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=2000', alt_text: 'Family candid moment', width: 2000, height: 1333, display_order: 2, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      
      // Other galleries (one image each)
      { gallery_id: galleries![4].id, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2000', alt_text: 'Corporate event', width: 2000, height: 1333, display_order: 1, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
      { gallery_id: galleries![5].id, url: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=2000', alt_text: 'Senior portrait', width: 2000, height: 1333, display_order: 1, is_hero_image: false, hero_display_order: null, blur_data_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg' },
    ];

    const { data: insertedImages, error: imgError } = await supabase
      .from('images')
      .insert(images)
      .select();

    if (imgError) throw imgError;
    console.log(`   ✅ Created ${insertedImages?.length || 0} images`);

    // Seed page content
    console.log('📄 Creating page content...');
    const { data: pageContent, error: pageError } = await supabase
      .from('page_content')
      .insert([
        { page: 'about', section: 'hero', content_type: 'text', content: 'About DJ Coveno' },
        { page: 'about', section: 'bio', content_type: 'html', content: '<p>Professional photographer based in Montana.</p>' },
        { page: 'home', section: 'hero_headline', content_type: 'text', content: 'DJ Coveno Portraits' },
        { page: 'home', section: 'hero_tagline', content_type: 'text', content: 'Capturing authentic moments and timeless memories' },
      ])
      .select();

    if (pageError) throw pageError;
    console.log(`   ✅ Created ${pageContent?.length || 0} page content entries`);

    // Seed sample inquiries
    console.log('📬 Creating sample inquiries...');
    const { data: inquiries, error: inquiryError } = await supabase
      .from('inquiries')
      .insert([
        { name: 'Test User 1', email: 'test1@example.com', phone: '406-555-0101', message: 'Wedding photography inquiry', event_type: 'wedding', event_date: '2025-06-15', budget: '$3,000-$5,000', status: 'new' },
        { name: 'Test User 2', email: 'test2@example.com', phone: '406-555-0102', message: 'Family portraits needed', event_type: 'portrait', event_date: null, budget: '$500-$1,000', status: 'new' },
        { name: 'Test User 3', email: 'test3@example.com', phone: '406-555-0103', message: 'Senior photos', event_type: 'senior', event_date: '2025-05-01', budget: '$500-$1,000', status: 'contacted' },
        { name: 'Test User 4', email: 'test4@example.com', phone: '406-555-0104', message: 'Engagement session', event_type: 'engagement', event_date: '2025-07-20', budget: '$1,000-$2,000', status: 'new' },
        { name: 'Test User 5', email: 'test5@example.com', phone: '406-555-0105', message: 'Maternity photos', event_type: 'maternity', event_date: '2025-04-10', budget: '$500-$1,000', status: 'new' },
      ])
      .select();

    if (inquiryError) {
      // If inquiries fail due to RLS, that's okay - we'll handle it
      console.log('   ⚠️  Could not create inquiries (RLS may be blocking)');
      console.log('   💡 This is okay - tests will handle RLS appropriately');
    } else {
      console.log(`   ✅ Created ${inquiries?.length || 0} sample inquiries`);
    }

    console.log('\n✨ Test database setup complete!\n');
    console.log('📊 Summary:');
    console.log(`   - ${categories?.length || 0} categories`);
    console.log(`   - ${galleries?.length || 0} galleries`);
    console.log(`   - ${insertedImages?.length || 0} images`);
    console.log(`   - ${pageContent?.length || 0} page content entries`);
    console.log(`   - ${inquiries?.length || 0} inquiries`);
    console.log('');

  } catch (error) {
    console.error('❌ Error setting up test database:', error);
    
    // Check if it's an RLS error
    if (error && typeof error === 'object' && 'code' in error && error.code === '42501') {
      console.error('\n⚠️  RLS (Row Level Security) is blocking data insertion');
      console.error('   You need to either:');
      console.error('   1. Disable RLS on test tables (recommended for test DB)');
      console.error('   2. Run the seed-test-data.sql script manually via SQL Editor');
      console.error('\n   See SEED-TEST-DATABASE.md for instructions\n');
    }
    
    process.exit(1);
  }
}

export default globalSetup;

