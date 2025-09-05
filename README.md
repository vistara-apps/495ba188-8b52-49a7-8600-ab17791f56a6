# KnowYourRights Now - Base Mini App

Your instant guide to rights and de-escalation during police interactions.

## Features

- **State-Specific Legal Cards**: AI-generated legal rights information tailored to your location
- **De-escalation Scripts**: Context-aware scripts in English and Spanish for various scenarios
- **One-Tap Recording**: Discreet recording functionality for interactions
- **Emergency Contact Alerts**: Instant notifications to trusted contacts with location
- **Mobile-First Design**: Optimized for quick access during stressful situations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **AI**: OpenAI API for content generation
- **Backend**: Supabase for data storage
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowyourrights-now
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `OPENAI_API_KEY`: Your OpenAI API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup (Supabase)

Create the following tables in your Supabase project:

```sql
-- User Configurations
CREATE TABLE user_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  predefined_contacts JSONB DEFAULT '[]',
  preferred_language TEXT DEFAULT 'en',
  default_jurisdiction TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interaction Logs
CREATE TABLE interaction_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location JSONB,
  recording_url TEXT,
  notes TEXT,
  contact_alert_sent BOOLEAN DEFAULT FALSE,
  interaction_type TEXT,
  status TEXT DEFAULT 'active'
);

-- Legal Card Content
CREATE TABLE legal_card_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  title TEXT NOT NULL,
  content_json JSONB NOT NULL,
  version TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE
);

-- Emergency Alerts
CREATE TABLE emergency_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  location JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent'
);

-- Recordings
CREATE TABLE recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  recording_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Key Components

### Core Features
- **Legal Rights Generation**: AI-powered, jurisdiction-specific legal information
- **De-escalation Scripts**: Contextual communication strategies
- **Emergency Systems**: One-tap recording and contact alerting
- **Multi-language Support**: English and Spanish interfaces

### Technical Architecture
- **MiniKit Integration**: Seamless Base blockchain connectivity
- **Responsive Design**: Mobile-first with glass morphism UI
- **Real-time Location**: GPS-based jurisdiction detection
- **Offline Capability**: Local storage for critical information

## API Endpoints

- `POST /api/generate-legal-card`: Generate jurisdiction-specific legal rights
- `POST /api/generate-scripts`: Create de-escalation scripts for scenarios

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended)
   ```bash
   vercel deploy
   ```

3. **Set environment variables** in your deployment platform

## Contributing

This app addresses critical civil rights and safety needs. Contributions should prioritize:
- Accuracy of legal information
- User safety and privacy
- Accessibility and usability under stress
- Multi-language support

## Legal Disclaimer

This app provides general legal information and should not be considered legal advice. Users should consult with qualified attorneys for specific legal situations. The app is designed to promote safety and awareness of constitutional rights.

## License

MIT License - See LICENSE file for details.

## Support

For support or questions about civil rights and police interactions, please consult local legal aid organizations and civil rights groups.
