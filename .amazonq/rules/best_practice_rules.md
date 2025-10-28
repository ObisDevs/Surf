# SurfAI Project Best Practice Rules

## 🏭 PRODUCTION BUILD STANDARDS

### 1. ALWAYS FOCUS ON PRODUCTION BUILD (INDUSTRY STANDARDS)

#### Code Quality & Architecture
- **TypeScript Strict Mode**: Always use strict TypeScript configuration with `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`
- **Error Handling**: Implement comprehensive error boundaries and try-catch blocks for all async operations
- **Performance First**: Optimize for Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Security by Design**: Never expose sensitive keys client-side; use secure backend proxies
- **Scalability**: Design for horizontal scaling from day one
- **Monitoring**: Implement logging, metrics, and alerting for production readiness

#### Build Configuration
- **Minification**: Always enable code minification and tree-shaking
- **Bundle Analysis**: Regular bundle size analysis and optimization
- **Environment Variables**: Proper separation of dev/staging/production configs
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Docker**: Containerized deployments for consistency

### 2. TYPESCRIPT ERROR & BUILD ERROR TESTING

#### Pre-Commit Validation
```bash
# Always run before any commit
npm run type-check     # TypeScript compilation check
npm run lint          # ESLint validation
npm run build         # Production build test
npm run test          # Unit/integration tests
```

#### TypeScript Configuration Standards
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

#### Build Error Prevention
- **Type Safety**: All functions must have explicit return types
- **Null Safety**: Handle all nullable values explicitly
- **Import/Export**: Use explicit imports, avoid `import *`
- **Async/Await**: Proper error handling for all async operations
- **API Contracts**: Strict typing for all API interfaces

## 🔒 SUPABASE SECURITY & PERFORMANCE RULES

### 3. DATABASE SECURITY (CRITICAL)

#### Row Level Security (RLS) - MANDATORY
```sql
-- ALWAYS enable RLS on user-facing tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_memory ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY "Users can view own data" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
```

#### API Key Management - ABSOLUTE RULES
- **NEVER** expose `service_role` key client-side
- **ALWAYS** use `anon` key for client-side operations
- **ALWAYS** proxy sensitive operations through Edge Functions/API Routes
- **ALWAYS** store secrets in environment variables

```typescript
// ❌ NEVER DO THIS
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY) // Client-side

// ✅ CORRECT - Server-side only
// In Edge Function or API Route
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY)
```

### 4. DATABASE PERFORMANCE OPTIMIZATION

#### Indexing Strategy (MANDATORY)
```sql
-- B-Tree indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- GIN indexes for JSONB columns
CREATE INDEX idx_posts_metadata ON posts USING GIN(metadata);

-- HNSW indexes for vector similarity (AI features)
CREATE INDEX idx_embeddings_vector ON embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;
```

#### Query Optimization Rules
- **ALWAYS** use `EXPLAIN ANALYZE` before deploying queries
- **NEVER** use `SELECT *` - specify columns explicitly
- **ALWAYS** use proper JOINs instead of N+1 queries
- **ALWAYS** implement pagination with `LIMIT` and proper indexing
- **ALWAYS** use materialized views for complex read-heavy operations

### 5. AUTHENTICATION & AUTHORIZATION

#### Multi-Factor Authentication (MFA)
- **MANDATORY** for production Supabase accounts
- **RECOMMENDED** for end users in sensitive applications
- **ALWAYS** use custom SMTP for production email delivery

#### JWT & Session Management
```typescript
// Secure session handling
export async function getServerSession(req: NextRequest) {
  const supabase = createServerClient(req)
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    throw new Error('Unauthorized')
  }
  
  return session
}
```

### 6. STORAGE SECURITY & PERFORMANCE

#### Storage Policies (MANDATORY)
```sql
-- Storage bucket policies
CREATE POLICY "Users can upload own files" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

#### Performance Optimization
- **ALWAYS** use CDN for static assets
- **ALWAYS** implement image optimization with Supabase transforms
- **ALWAYS** use resumable uploads (TUS) for large files
- **ALWAYS** implement proper caching headers

## 🧠 AI INTEGRATION SECURITY

### 7. AI API KEY PROTECTION (CRITICAL)

#### Secure Proxy Pattern (MANDATORY)
```typescript
// ✅ CORRECT - Edge Function proxy
export default async function handler(req: Request) {
  // Validate user session
  const session = await validateSession(req)
  
  // Proxy to AI API with server-side key
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Server-side only
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(validatedPayload)
  })
  
  return response
}
```

#### Input Validation & Sanitization
- **ALWAYS** validate all AI inputs server-side
- **ALWAYS** sanitize outputs before storing/displaying
- **ALWAYS** implement rate limiting for AI API calls
- **ALWAYS** log AI interactions for audit trails

### 8. VECTOR OPERATIONS & EMBEDDINGS

#### pgvector Performance
```sql
-- MANDATORY HNSW index for vector similarity
CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops);

-- Optimize vector queries
SELECT content, embedding <=> query_embedding AS similarity
FROM embeddings
WHERE embedding <=> query_embedding < 0.8
ORDER BY similarity
LIMIT 10;
```

## 🌐 CHROME EXTENSION SECURITY

### 9. MANIFEST V3 COMPLIANCE (MANDATORY)

#### Content Security Policy
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; connect-src https://*.supabase.co https://api.openai.com"
  }
}
```

#### Secure Communication Pattern
```typescript
// Background script - secure operations
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'SECURE_API_CALL') {
    // Validate origin
    if (!isValidOrigin(sender)) return
    
    // Make secure API call
    const result = await makeSecureSupabaseCall(message.data)
    sendResponse(result)
  }
})

// Content script - minimal permissions
chrome.runtime.sendMessage({
  type: 'SECURE_API_CALL',
  data: sanitizedData
})
```

### 10. EXTENSION DATA SECURITY

#### Local Storage Encryption
```typescript
// Encrypt sensitive data before local storage
const encryptedData = await encrypt(sensitiveData, userKey)
await chrome.storage.local.set({ data: encryptedData })

// Decrypt on retrieval
const { data } = await chrome.storage.local.get('data')
const decryptedData = await decrypt(data, userKey)
```

## 🚀 PERFORMANCE OPTIMIZATION

### 11. NEXT.JS OPTIMIZATION RULES

#### Data Fetching Strategy
- **SSR** for user-specific, SEO-critical pages
- **SSG + ISR** for public, cacheable content
- **CSR** for highly interactive, real-time features
- **API Routes** for secure backend operations

#### Bundle Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

### 12. EDGE FUNCTIONS OPTIMIZATION

#### Global Distribution Strategy
```typescript
// Optimize for low latency
export default async function handler(req: Request) {
  // Cache frequently accessed data
  const cached = await getFromCache(key)
  if (cached) return cached
  
  // Process and cache result
  const result = await processRequest(req)
  await setCache(key, result, ttl)
  
  return result
}
```

## 🔍 MONITORING & OBSERVABILITY

### 13. PRODUCTION MONITORING (MANDATORY)

#### Error Tracking
```typescript
// Comprehensive error handling
try {
  await riskyOperation()
} catch (error) {
  // Log with context
  logger.error('Operation failed', {
    error: error.message,
    stack: error.stack,
    userId: session?.user?.id,
    timestamp: new Date().toISOString()
  })
  
  // User-friendly error response
  throw new Error('Operation temporarily unavailable')
}
```

#### Performance Metrics
- **ALWAYS** monitor Core Web Vitals
- **ALWAYS** track API response times
- **ALWAYS** monitor database query performance
- **ALWAYS** set up alerts for anomalies

## 🧪 TESTING REQUIREMENTS

### 14. COMPREHENSIVE TESTING STRATEGY

#### Unit Tests (MANDATORY)
```typescript
// Test all critical functions
describe('User Authentication', () => {
  it('should validate user session', async () => {
    const session = await validateSession(mockRequest)
    expect(session).toBeDefined()
    expect(session.user.id).toBe(mockUserId)
  })
})
```

#### Integration Tests
- **ALWAYS** test Supabase RLS policies
- **ALWAYS** test API endpoints with various auth states
- **ALWAYS** test Edge Function deployments
- **ALWAYS** test Chrome extension message passing

### 15. DEPLOYMENT CHECKLIST

#### Pre-Production Validation
- [ ] All TypeScript errors resolved
- [ ] All tests passing (unit, integration, e2e)
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] RLS policies tested and verified
- [ ] API keys properly configured
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery procedures tested

#### Production Deployment
- [ ] Environment variables validated
- [ ] SSL certificates configured
- [ ] CDN properly configured
- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Chrome extension published (if applicable)

---

## 🚨 CRITICAL SECURITY REMINDERS

1. **NEVER** commit API keys or secrets to version control
2. **ALWAYS** enable RLS on all user-facing tables
3. **NEVER** expose `service_role` key client-side
4. **ALWAYS** validate and sanitize all inputs
5. **ALWAYS** use HTTPS in production
6. **ALWAYS** implement proper error handling
7. **ALWAYS** log security events for audit trails
8. **ALWAYS** keep dependencies updated and scan for vulnerabilities

These rules are **NON-NEGOTIABLE** for production deployment and must be followed throughout the development lifecycle.