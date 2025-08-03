# ToolsHub

A comprehensive collection of 50+ web tools for developers, designers, and professionals. Built with React, TypeScript, and Supabase.

## Features

- 🔧 50+ Professional Tools
- 🔒 Privacy-First (Client-side processing)
- ⚡ Lightning Fast Performance
- 🌙 Dark Mode Support
- 💾 Data Export Capabilities
- 🔐 Secure Authentication
- 💳 Premium Subscriptions via Polar.sh

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments**: Polar.sh
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion

## Tool Categories

### 💰 Financial Tools
- ROI Calculator
- Loan EMI Calculator
- Compound Interest Calculator
- Tax Calculator
- Currency Converter
- And more...

### 👨‍💻 Developer Tools
- JSON Formatter
- Hash Generator
- Base64 Encoder/Decoder
- Regex Tester
- UUID Generator
- And more...

### 🎨 Design Tools
- QR Code Generator
- Color Palette Generator
- CSS Gradient Generator
- Pattern Generator
- And more...

### ✍️ Text Tools
- Word Counter
- Case Converter
- Lorem Ipsum Generator
- Text Cleaner
- And more...

## Payment Integration

This project uses Polar.sh for payment processing:

1. **Setup Polar.sh**:
   - Create account at [polar.sh](https://polar.sh)
   - Get your API keys
   - Set up products and prices

2. **Environment Variables**:
   ```
   POLAR_ACCESS_TOKEN=your_polar_access_token
   POLAR_WEBHOOK_SECRET=your_webhook_secret
   ```

3. **Webhook Configuration**:
   - Set webhook URL to: `https://your-project.supabase.co/functions/v1/polar-webhook`
   - Enable events: `subscription.created`, `subscription.updated`, `subscription.cancelled`, `checkout.completed`

## Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase and Polar.sh credentials

3. **Database Setup**:
   - Run migrations: `supabase db reset`

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured for deployment on various platforms:

- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config deployment
- **Supabase**: Edge Functions auto-deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email keepknowing583@gmail.com or join our Discord community.