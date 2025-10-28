# SurfAI Setup Instructions

## Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Supabase account
- OpenAI API key
- Gemini API key (optional)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

#### Web Backend
Create `web/.env.local`:
```bash
cp web/.env.example web/.env.local
```

Edit `web/.env.local` with your credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (NEVER expose client-side)
- `OPENAI_API_KEY`: Your OpenAI API key
- `GEMINI_API_KEY`: Your Gemini API key

### 3. Type Check
```bash
npm run type-check
```

### 4. Lint
```bash
npm run lint
```

### 5. Build

#### Web Backend
```bash
npm run build:web
```

#### Chrome Extension
```bash
npm run build:extension
```

## Development

### Web Backend
```bash
npm run dev:web
```

### Chrome Extension
```bash
npm run dev:extension
```

Load extension in Chrome:
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `extension/dist` directory

## Security Checklist
- [ ] Environment variables configured
- [ ] Service role key NOT in client-side code
- [ ] RLS policies will be enabled in Milestone 2
- [ ] API keys stored securely
- [ ] TypeScript strict mode enabled
- [ ] Build passes without errors

## Next Steps
Proceed to Milestone 2: Supabase Vector Memory Setup
