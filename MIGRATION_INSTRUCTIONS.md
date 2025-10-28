# Database Migration Instructions

## Run Migrations via Supabase Dashboard

1. Go to your Supabase project: https://supabase.com/dashboard/project/htotnebsadkxluaoddhs

2. Navigate to **SQL Editor**

3. Execute migrations in order:

### Migration 1: Initial Schema
Copy and paste content from: `supabase/migrations/20250101000000_initial_schema.sql`

Click **Run** to execute.

### Migration 2: Vector Search Function
Copy and paste content from: `supabase/migrations/20250101000001_vector_search_function.sql`

Click **Run** to execute.

## Verify Installation

Run this query in SQL Editor:
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'ai_memory', 'logs');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'ai_memory', 'logs');

-- Check vector extension
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'ai_memory', 'logs');
```

Expected results:
- 3 tables created
- RLS enabled on all tables (rowsecurity = true)
- vector extension installed
- Multiple indexes including HNSW for embeddings

## Test Vector Search

```sql
-- Insert test memory (replace user_id with actual auth.users id)
INSERT INTO public.ai_memory (user_id, content, embedding, metadata)
VALUES (
  'YOUR_USER_ID_HERE',
  'Test memory content',
  array_fill(0.1, ARRAY[1536])::vector,
  '{"test": true}'::jsonb
);

-- Test similarity search
SELECT * FROM search_memories(
  array_fill(0.1, ARRAY[1536])::vector,
  'YOUR_USER_ID_HERE'::uuid,
  0.5,
  10
);
```

## Next Steps
After successful migration, proceed with API implementation.
