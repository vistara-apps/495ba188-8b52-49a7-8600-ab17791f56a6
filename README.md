# KnowYourRights Now

Your instant guide to rights and de-escalation during police interactions.

## 🚀 Features

### Core Features
- **State-Specific Legal Cards**: Generates mobile-optimized digital cards with key rights, dos/don'ts, and relevant state laws based on user location
- **De-escalation Scripts**: Ready-to-use, context-aware scripts in English and Spanish for various interaction scenarios
- **One-Tap Recording**: Discreet audio/video recording with one-tap activation
- **Emergency Contact Alert**: Instant notification to pre-selected trusted contacts with location and status

### Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Supabase** for backend and real-time data
- **OpenAI API** for AI-generated content
- **Stripe** for payments
- **IPFS/Pinata** for decentralized storage
- **Base Chain** integration ready
- **Farcaster Frame** compatible

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-4 for content generation
- **Payments**: Stripe for fiat, Web3 wallet integration
- **Storage**: IPFS via Pinata for decentralized storage
- **Blockchain**: Base chain integration with Privy/WalletConnect

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowyourrights-now
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # AI Services
   OPENAI_API_KEY=your_openai_api_key

   # Authentication
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   PRIVY_APP_SECRET=your_privy_app_secret

   # Payments
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # IPFS Storage
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_api_key
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor:
   
   ```sql
   -- Create tables
   CREATE TABLE user_configurations (
     "userId" TEXT PRIMARY KEY,
     "predefinedContacts" JSONB DEFAULT '[]',
     "preferredLanguage" TEXT DEFAULT 'en',
     "defaultJurisdiction" TEXT,
     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE emergency_contacts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     "userId" TEXT REFERENCES user_configurations("userId"),
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT,
     relationship TEXT NOT NULL,
     "isPrimary" BOOLEAN DEFAULT FALSE
   );

   CREATE TABLE interaction_logs (
     "logId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     "userId" TEXT REFERENCES user_configurations("userId"),
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     location JSONB NOT NULL,
     "recordingUrl" TEXT,
     notes TEXT,
     "contactAlertSent" BOOLEAN DEFAULT FALSE,
     "interactionType" TEXT NOT NULL,
     status TEXT NOT NULL
   );

   CREATE TABLE legal_card_content (
     "cardId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     jurisdiction TEXT NOT NULL,
     title TEXT NOT NULL,
     "contentJson" JSONB NOT NULL,
     version TEXT NOT NULL,
     "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     "isVerified" BOOLEAN DEFAULT FALSE
   );

   CREATE TABLE recording_sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     "userId" TEXT REFERENCES user_configurations("userId"),
     "startTime" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     "endTime" TIMESTAMP WITH TIME ZONE,
     duration INTEGER,
     "fileUrl" TEXT,
     "ipfsHash" TEXT,
     "isActive" BOOLEAN DEFAULT TRUE,
     location JSONB NOT NULL
   );

   CREATE TABLE payment_transactions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     "userId" TEXT REFERENCES user_configurations("userId"),
     amount DECIMAL NOT NULL,
     currency TEXT NOT NULL,
     type TEXT NOT NULL,
     status TEXT NOT NULL,
     "productType" TEXT NOT NULL,
     "transactionHash" TEXT,
     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE user_configurations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE interaction_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE recording_sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Users
1. **Location Setup**: Allow location access to get state-specific legal information
2. **Emergency Contacts**: Add trusted contacts for emergency alerts
3. **Know Your Rights**: View your legal rights based on your location
4. **Get Scripts**: Generate de-escalation phrases for different scenarios
5. **Emergency Features**: Use one-tap recording and emergency alerts when needed

### For Developers
- **API Routes**: All API endpoints are in `/src/app/api/`
- **Components**: Reusable UI components in `/src/components/`
- **Hooks**: Custom React hooks in `/src/hooks/`
- **Types**: TypeScript definitions in `/src/types/`
- **Utils**: Utility functions in `/src/lib/`

## 🔧 Configuration

### Design System
The app uses a custom design system defined in `tailwind.config.js`:
- **Colors**: Custom color palette for legal/emergency context
- **Spacing**: Consistent spacing tokens
- **Typography**: Optimized for mobile readability
- **Shadows**: Subtle depth for cards and modals

### API Integration
- **OpenAI**: For generating legal content and scripts
- **Supabase**: For data persistence and real-time updates
- **Stripe**: For premium feature payments
- **Pinata**: For IPFS storage of recordings

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security & Privacy

- **Data Encryption**: All sensitive data is encrypted at rest
- **Location Privacy**: Location data is only used for jurisdiction detection
- **Recording Security**: Recordings can be stored on IPFS for decentralization
- **Emergency Contacts**: Contact information is encrypted and access-controlled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our Discord for community support

## 🙏 Acknowledgments

- **Legal Experts**: For reviewing and validating legal content
- **Civil Rights Organizations**: For guidance on best practices
- **Open Source Community**: For the amazing tools and libraries
- **Base Ecosystem**: For providing the infrastructure for decentralized apps

---

**Disclaimer**: This app provides educational information only and does not constitute legal advice. Always consult with a qualified attorney for specific legal situations.

