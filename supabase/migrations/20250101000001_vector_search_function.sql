-- Function for vector similarity search
CREATE OR REPLACE FUNCTION search_memories(
  query_embedding vector(1536),
  query_user_id UUID,
  match_threshold FLOAT DEFAULT 0.8,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  content TEXT,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_memory.id,
    ai_memory.user_id,
    ai_memory.content,
    ai_memory.embedding,
    ai_memory.metadata,
    ai_memory.created_at,
    1 - (ai_memory.embedding <=> query_embedding) AS similarity
  FROM public.ai_memory
  WHERE ai_memory.user_id = query_user_id
    AND 1 - (ai_memory.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_memory.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
