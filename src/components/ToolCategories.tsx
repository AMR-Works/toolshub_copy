import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Code2,
  Palette,
  FileText,
  Receipt,
  Compass,
  TrendingUp,
  Clock,
  ArrowRight,
  Lock,
  Crown,
} from 'lucide-react';

export const categories = [
  {
    title: '💰 Financial Wizards',
    description: 'Master your money with smart, simple calculators for every goal',
    icon: Calculator,
    color: 'from-accent to-accent/50',
    tools: [
      'roi-calculator',
      'loan-emi-calculator',
      'simple-interest-calculator',
      'investment-return-calculator',
      'retirement-corpus-calculator',
      'tax-calculator',
      'break-even-point-calculator',
      'percentage-calculator',
      'currency-conversion',
      'savings-goal-calculator',
      'compound-interest-calculator',
    ],
    premium: false,
  },
  {
    title: '👨‍💻 Developer Tools',
    description: 'Power-packed utilities every coder will love. Debug, decode, and build faster',
    icon: Code2,
    color: 'from-primary to-primary/50',
    tools: [
      'json-formatter',
      'hash-generator',
      'base64-encoder-decoder',
      'regex-tester',
      'uuid-generator',
      'number-base-converter',
      'jwt-decoder',
      'html-encoder-decoder',
      'url-encoder-decoder',
      'user-agent-parser',
    ],
    premium: false,
  },
  {
    title: '🎨 Design Generators',
    description: 'Create stunning visuals — from gradients to QR codes — in seconds',
    icon: Palette,
    color: 'from-secondary to-secondary/50',
    tools: [
      'qr-generator',
      'color-palette-generator',
      'css-gradient-generator',
      'glassmorphism-generator',
      'pattern-generator',
      'blob-generator',
      'neumorphism-generator',
      'box-shadow-generator',
      'border-radius-generator',
      'spacing-grid-generator',
    ],
    premium: true,
  },
  {
    title: '✍️ Text & Content',
    description: 'Clean, count, convert, and transform text like a pro',
    icon: FileText,
    color: 'from-card to-card/50',
    tools: [
      'word-counter',
      'lorem-ipsum-generator',
      'case-converter',
      'text-reverser',
      'text-cleaner',
      'text-randomizer',
      'list-sorter',
      'line-counter',
      'reading-time-estimator',
      'find-replace-tool',
    ],
    premium: false,
  },
  {
    title: '📄 Business Documents',
    description: 'Generate invoices, receipts, and reports — professionally and instantly',
    icon: Receipt,
    color: 'from-border to-border/50',
    tools: [
      'invoice-generator',
      'receipt-maker',
      'expense-report-generator',
      'timesheet-generator',
      'work-schedule-maker',
      'quotation-generator',
      'purchase-order-generator',
      'meeting-minutes-generator',
      'business-card-maker',
    ],
    premium: false,
  },
  {
    title: '📐 Math & Engineering',
    description: 'Solve, convert, and calculate with precision — perfect for students & engineers',
    icon: Compass,
    color: 'from-muted-foreground to-muted-foreground/50',
    tools: [
      'scientific-calculator',
      'unit-converter',
      'bmi-calculator',
      'area-calculator',
      'volume-calculator',
      'triangle-solver',
      'ohms-law-calculator',
      'snr-calculator',
      'frequency-wavelength-converter',
    ],
    premium: false,
  },
  {
    title: '📢 Marketing Tools',
    description: 'Optimize performance with UTM links, A/B testing, CTR tools, and more',
    icon: TrendingUp,
    color: 'from-foreground to-foreground/50',
    tools: [
      'utm-builder',
      'meta-tag-generator',
      'ab-test-significance-calculator',
      'ctr-calculator',
      'roi-calculator-marketing',
      'engagement-rate-calculator',
      'keyword-density-analyzer',
      'slug-generator',
    ],
    premium: true,
  },
  {
    title: '🕒 Date & Time',
    description: 'From countdowns to moon phases — everything time-related in one place',
    icon: Clock,
    color: 'from-background to-background/50',
    tools: [
      'date-calculator',
      'age-calculator',
      'world-clock',
      'countdown-timer',
      'stopwatch',
      'pomodoro-timer',
      'day-finder',
      'moon-phase-viewer',
      'time-zone-converter',
    ],
    premium: false,
  },
];

export const ToolCategories = () => {
  return (
    <section id="tools" className="py-4 sm:py-4 lg:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mt-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="text-foreground">Powerful Tools for</span>
            <br />
            <span className="text-primary">Every Use Case</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-5">
            From financial calculations to design generation, we've got you covered with 50+ professional tools.
          </p>
        </div>

        {/* Categories Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 mb-12">
  {categories.map((category) => {
    const Icon = category.icon;
    return (
      <Link
        key={category.title}
        to={`/tools/${category.title.toLowerCase().replace(/\s/g, '-')}`}
        className="group relative bg-white/5 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-6 hover:bg-card-foreground/10 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/50"
      >

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {category.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
          {category.description}
        </p>

        {/* Tool List */}
        <div className="space-y-1 mb-3 sm:mb-4">
          {category.tools.map((tool) => (
            <div
              key={tool}
              className="flex items-center text-xs sm:text-sm text-gray-500"
            >
              <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
              <span>{tool}</span>
            </div>
          ))}
        </div>

        {/* Explore Button */}
        <div className="flex items-center text-primary group-hover:text-foreground transition-colors">
          <span className="text-sm font-medium mr-2">Explore</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    );
  })}
</div>
      </div>
    </section>
  );
};
