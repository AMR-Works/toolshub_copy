import React, { ReactNode, useEffect } from 'react';
import { Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ToolCategories, categories } from '@/components/ToolCategories';
import { Lock, ArrowRight, Sparkles, ReceiptText, FileSpreadsheet, FileText, ShoppingCart, Clipboard, Contact } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
// Tool Icons
import {
  Key,
  QrCode,
  Palette,
  Hash,
  Braces,
  Calculator,
  LineChart,
  Banknote,
  Percent,
  Languages,
  Type,
  AlignLeft,
  Timer,
  Clock,
  Moon,
  Globe,
  CalendarDays,
  Coffee,
  Timer as StopwatchIcon,
  Link as LinkIcon,
  Tag,
  FlaskConical,
  MousePointerClick,
  Heart,
  Search,
  Scale,
  Ruler,
  Square,
  Calculator as CalculatorIcon,
  Box,
  Triangle,
  Zap,
  Signal,
  Waves,
} from 'lucide-react';

// Tool Components
import CaseConverter from '@/components/tools/text/CaseConverter';
import FindReplaceTool from '@/components/tools/text/FindReplaceTool';
import LineCounter from '@/components/tools/text/LineCounter';
import ListSorter from '@/components/tools/text/ListSorter';
import ReadingTimeEstimator from '@/components/tools/text/ReadingTimeEstimator';
import TextCleaner from '@/components/tools/text/TextCleaner';
import TextRandomizer from '@/components/tools/text/TextRandomizer';
import TextReverser from '@/components/tools/text/TextReverser';
import { HashGenerator } from '@/components/tools/developer/HashGenerator';
import { JSONFormatter } from '@/components/tools/developer/JSONFormatter';
import CompoundInterestCalculator from '@/components/tools/financial/CompoundInterestCalculator';
import { ROICalculator } from '@/components/tools/financial/ROICalculator';
import { LoanEMICalculator } from '@/components/tools/financial/LoanEMICalculator';
import SimpleInterestCalculator from '@/components/tools/financial/SimpleInterestCalculator';
import { InvestmentReturnCalculator } from '@/components/tools/financial/InvestmentReturnCalculator';
import { RetirementCorpusCalculator } from '@/components/tools/financial/RetirementCorpusCalculator';
import { TaxCalculator } from '@/components/tools/financial/TaxCalculator';
import { BreakEvenPointCalculator } from '@/components/tools/financial/BreakEvenPointCalculator';
import { PercentageCalculator } from '@/components/tools/financial/PercentageCalculator';
import { CurrencyConversion } from '@/components/tools/financial/CurrencyConversion';
import SavingsGoalCalculator from '@/components/tools/financial/SavingsGoalCalculator';
import { LoremIpsumGenerator } from '@/components/tools/text/LoremIpsumGenerator';
import { WordCounter } from '@/components/tools/text/WordCounter';
import QRGenerator from '@/components/tools/design/QRGenerator';
import ColorPaletteGenerator from '@/components/tools/design/ColorPaletteGenerator';
import GradientGenerator from '@/components/tools/design/GradientGenerator';
import GlassmorphismGenerator from '@/components/tools/design/GlassmorphismGenerator';
import PatternGenerator from '@/components/tools/design/PatternGenerator';
import BlobGenerator from '@/components/tools/design/BlobGenerator';
import NeumorphismGenerator from '@/components/tools/design/NeumorphismGenerator';
import BoxShadowGenerator from '@/components/tools/design/BoxShadowGenerator';
import BorderRadiusGenerator from '@/components/tools/design/BorderRadiusGenerator';
import SpacingGridGenerator from '@/components/tools/design/SpacingGridGenerator';
import Base64Converter from '@/components/tools/developer/Base64Converter';
import RegexTester from '@/components/tools/developer/RegexTester';
import UUIDGenerator from '@/components/tools/developer/UUIDGenerator';
import NumberBaseConverter from '@/components/tools/developer/NumberBaseConverter';
import JWTDecoder from '@/components/tools/developer/JWTDecoder';
import HtmlEncoderDecoder from '@/components/tools/developer/HtmlEncoderDecoder';
import UrlEncoderDecoder from '@/components/tools/developer/UrlEncoderDecoder';
import HexRgbConverter from '@/components/tools/developer/HexRgbConverter';
import UserAgentParser from '@/components/tools/developer/UserAgentParser';
import { DateCalculator } from '@/components/tools/datetime/DateCalculator';
import { AgeCalculator } from '@/components/tools/datetime/AgeCalculator';
import { WorldClock } from '@/components/tools/datetime/WorldClock';
import { CountdownTimer } from '@/components/tools/datetime/CountdownTimer';
import { Stopwatch } from '@/components/tools/datetime/Stopwatch';
import { PomodoroTimer } from '@/components/tools/datetime/PomodoroTimer';
import { DayFinder } from '@/components/tools/datetime/DayFinder';
import { MoonPhaseViewer } from '@/components/tools/datetime/MoonPhaseViewer';
import { TimeZoneConverter } from '@/components/tools/datetime/TimeZoneConverter';
import { UTMBuilder } from '@/components/tools/marketing/UTMBuilder';
import { MetaTagGenerator } from '@/components/tools/marketing/MetaTagGenerator';
import { ABTestSignificanceCalculator } from '@/components/tools/marketing/ABTestSignificanceCalculator';
import { CTRCalculator } from '@/components/tools/marketing/CTRCalculator';
import { ROICalculator as MarketingROICalculator } from '@/components/tools/marketing/ROICalculator';
import { EngagementRateCalculator } from '@/components/tools/marketing/EngagementRateCalculator';
import { KeywordDensityAnalyzer } from '@/components/tools/marketing/KeywordDensityAnalyzer';
import { SlugGenerator } from '@/components/tools/marketing/SlugGenerator';
import BMICalculator from '@/components/tools/math/BMICalculator';
import UnitConverter from '@/components/tools/math/UnitConverter';
import AreaCalculator from '@/components/tools/math/AreaCalculator';
import ScientificCalculator from '@/components/tools/math/ScientificCalculator';
import VolumeCalculator from '@/components/tools/math/VolumeCalculator';
import TriangleSolver from '@/components/tools/math/TriangleSolver';
import OhmsLawCalculator from '@/components/tools/math/OhmsLawCalculator';
import SNRatioCalculator from '@/components/tools/math/SNRatioCalculator';
import FrequencyWavelengthConverter from '@/components/tools/math/FrequencyWavelength';
import InvoiceGenerator from '@/components/tools/business/InvoiceGenerator';
import ReceiptMaker from '@/components/tools/business/ReceiptMaker';
import ExpenseReport from '@/components/tools/business/ExpenseReport';
import TimesheetGenerator from '@/components/tools/business/TimesheetGenerator';
import WorkScheduleMaker from '@/components/tools/business/WorkScheduleMaker';
import QuotationGenerator from '@/components/tools/business/QuotationGenerator';
import PurchaseOrderGenerator from '@/components/tools/business/PurchaseOrderGenerator';
import MeetingMinutes from '@/components/tools/business/MeetingMinutes';
import BusinessCardMaker from '@/components/tools/business/BusinessCardMaker';

// Tool icon mapping
const toolIcons: Record<string, React.ReactNode> = {
  'password-generator': <Key className="h-6 w-6" />,
  'qr-generator': <QrCode className="h-6 w-6" />,
  'color-palette-generator': <Palette className="h-6 w-6" />,
  'css-gradient-generator': <Palette className="h-6 w-6" />,
  'glassmorphism-generator': <Square className="h-6 w-6" />,
  'pattern-generator': <Sparkles className="h-6 w-6" />,
  'blob-generator': <Box className="h-6 w-6" />,
  'neumorphism-generator': <Square className="h-6 w-6" />,
  'box-shadow-generator': <Box className="h-6 w-6" />,
  'border-radius-generator': <Square className="h-6 w-6" />,
  'spacing-grid-generator': <Ruler className="h-6 w-6" />,
  'hash-generator': <Hash className="h-6 w-6" />,
  'json-formatter': <Braces className="h-6 w-6" />,
  'base64-converter': <Key className="h-6 w-6" />,
  'regex-tester': <FlaskConical className="h-6 w-6" />,
  'uuid-generator': <Key className="h-6 w-6" />,
  'number-base-converter': <Hash className="h-6 w-6" />,
  'jwt-decoder': <Key className="h-6 w-6" />,
  'html-encoder-decoder': <Braces className="h-6 w-6" />,
  'url-encoder-decoder': <LinkIcon className="h-6 w-6" />,
  'hex-rgb-converter': <Palette className="h-6 w-6" />,
  'user-agent-parser': <Search className="h-6 w-6" />,
  'compound-interest-calculator': <Calculator className="h-6 w-6" />,
  'roi-calculator': <LineChart className="h-6 w-6" />,
  'loan-emi-calculator': <Banknote className="h-6 w-6" />,
  'simple-interest-calculator': <Percent className="h-6 w-6" />,
  'investment-return-calculator': <LineChart className="h-6 w-6" />,
  'retirement-corpus-calculator': <Banknote className="h-6 w-6" />,
  'tax-calculator': <Calculator className="h-6 w-6" />,
  'break-even-point-calculator': <Calculator className="h-6 w-6" />,
  'percentage-calculator': <Percent className="h-6 w-6" />,
  'currency-conversion': <Languages className="h-6 w-6" />,
  'savings-goal-calculator': <Banknote className="h-6 w-6" />,
  'lorem-ipsum-generator': <Type className="h-6 w-6" />,
  'word-counter': <AlignLeft className="h-6 w-6" />,
  'date-calculator': <CalendarDays className="h-6 w-6" />,
  'age-calculator': <Clock className="h-6 w-6" />,
  'world-clock': <Globe className="h-6 w-6" />,
  'countdown-timer': <Timer className="h-6 w-6" />,
  'stopwatch': <StopwatchIcon className="h-6 w-6" />,
  'pomodoro-timer': <Coffee className="h-6 w-6" />,
  'day-finder': <CalendarDays className="h-6 w-6" />,
  'moon-phase-viewer': <Moon className="h-6 w-6" />,
  'time-zone-converter': <Globe className="h-6 w-6" />,
  'utm-builder': <LinkIcon className="h-6 w-6" />,
  'meta-tag-generator': <Tag className="h-6 w-6" />,
  'ab-test-significance-calculator': <FlaskConical className="h-6 w-6" />,
  'ctr-calculator': <MousePointerClick className="h-6 w-6" />,
  'roi-calculator-marketing': <LineChart className="h-6 w-6" />,
  'engagement-rate-calculator': <Heart className="h-6 w-6" />,
  'keyword-density-analyzer': <Search className="h-6 w-6" />,
  'slug-generator': <Type className="h-6 w-6" />,
  'bmi-calculator': <Scale className="h-6 w-6" />,
  'unit-converter': <Ruler className="h-6 w-6" />,
  'area-calculator': <Square className="h-6 w-6" />,
  'scientific-calculator': <CalculatorIcon className="h-6 w-6" />,
  'volume-calculator': <Box className="h-6 w-6" />,
  'triangle-solver': <Triangle className="h-6 w-6" />,
  'ohms-law-calculator': <Zap className="h-6 w-6" />,
  'snr-calculator': <Signal className="h-6 w-6" />,
  'frequency-wavelength-converter': <Waves className="h-6 w-6" />,
  'invoice-generator': <ReceiptText className="h-6 w-6" />,
  'receipt-maker': <ReceiptText className="h-6 w-6" />,
  'expense-report-generator': <FileSpreadsheet className="h-6 w-6" />,
  'timesheet-generator': <Clock className="h-6 w-6" />,
  'work-schedule-maker': <CalendarDays className="h-6 w-6" />,
  'quotation-generator': <FileText className="h-6 w-6" />,
  'purchase-order-generator': <ShoppingCart className="h-6 w-6" />,
  'meeting-minutes-generator': <Clipboard className="h-6 w-6" />,
  'business-card-maker': <Contact className="h-6 w-6" />,
  'case-converter': <Type className="h-6 w-6" />,
  'find-replace-tool': <Search className="h-6 w-6" />,
  'line-counter': <AlignLeft className="h-6 w-6" />,
  'list-sorter': <AlignLeft className="h-6 w-6" />,
  'reading-time-estimator': <Timer className="h-6 w-6" />,
  'text-cleaner': <Sparkles className="h-6 w-6" />,
  'text-randomizer': <Zap className="h-6 w-6" />,
  'text-reverser': <ArrowRight className="h-6 w-6 rotate-180" />,
};

const ToolDisplay = ({ slug }: { slug?: string }): ReactNode => {
  const { user, loading, profile } = useAuth();

  // All premium tools including the ones you specified
  const premiumTools = [
    'tax-calculator',
    'currency-conversion',
    'loan-emi-calculator',
    'countdown-timer',
    'pomodoro-timer',
    'day-finder',
    'moon-phase-viewer',
    'scientific-calculator',
    'bmi-calculator',
    'unit-converter',
    'reading-time-estimator',
    'text-cleaner',
    'list-sorter',
    'find-replace-tool',
    'qr-generator',
    'glassmorphism-generator',
    'pattern-generator',
    'regex-tester',
    'jwt-decoder',
    'number-base-converter',
    'user-agent-parser',
    'ab-test-significance-calculator',
    'ctr-calculator',
    'roi-calculator-marketing',
    'engagement-rate-calculator',
    'keyword-density-analyzer',
    'expense-report-generator',
    'timesheet-generator',
    'work-schedule-maker',
    'purchase-order-generator',
    'invoice-generator',
    'business-card-maker'
  ];

  // Check if tool is premium and user is not premium
  if (premiumTools.includes(slug || '') && (!profile?.is_premium || !user) && !loading) {
    return <Navigate to="/pricing" replace />;
  }

  // Check if user is not authenticated for any tool
  if (!user && !loading && slug) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  switch (slug) {
    case 'case-converter':
      return <CaseConverter />;
    case 'find-replace-tool':
      return <FindReplaceTool />;
    case 'line-counter':
      return <LineCounter />;
    case 'list-sorter':
      return <ListSorter />;
    case 'reading-time-estimator':
      return <ReadingTimeEstimator />;
    case 'text-cleaner':
      return <TextCleaner />;
    case 'text-randomizer':
      return <TextRandomizer />;
    case 'text-reverser':
      return <TextReverser />;
    case 'hash-generator':
      return <HashGenerator />;
    case 'json-formatter':
      return <JSONFormatter />;
    case 'compound-interest-calculator':
      return <CompoundInterestCalculator />;
    case 'roi-calculator':
      return <ROICalculator />;
    case 'loan-emi-calculator':
      return <LoanEMICalculator />;
    case 'simple-interest-calculator':
      return <SimpleInterestCalculator />;
    case 'investment-return-calculator':
      return <InvestmentReturnCalculator />;
    case 'retirement-corpus-calculator':
      return <RetirementCorpusCalculator />;
    case 'tax-calculator':
      return <TaxCalculator />;
    case 'break-even-point-calculator':
      return <BreakEvenPointCalculator />;
    case 'percentage-calculator':
      return <PercentageCalculator />;
    case 'currency-conversion':
      return <CurrencyConversion />;
    case 'savings-goal-calculator':
      return <SavingsGoalCalculator />;
    case 'lorem-ipsum-generator':
      return <LoremIpsumGenerator />;
    case 'word-counter':
      return <WordCounter />;
    case 'date-calculator':
      return <DateCalculator />;
    case 'age-calculator':
      return <AgeCalculator />;
    case 'world-clock':
      return <WorldClock />;
    case 'bmi-calculator':
      return <BMICalculator />;
    case 'unit-converter':
      return <UnitConverter />;
    case 'area-calculator':
      return <AreaCalculator />;
    case 'scientific-calculator':
      return <ScientificCalculator />;
    case 'volume-calculator':
      return <VolumeCalculator />;
    case 'triangle-solver':
      return <TriangleSolver />;
    case 'ohms-law-calculator':
      return <OhmsLawCalculator />;
    case 'snr-calculator':
      return <SNRatioCalculator />;
    case 'frequency-wavelength-converter':
      return <FrequencyWavelengthConverter />;
    case 'countdown-timer':
      return <CountdownTimer />;
    case 'stopwatch':
      return <Stopwatch />;
    case 'pomodoro-timer':
      return <PomodoroTimer />;
    case 'day-finder':
      return <DayFinder />;
    case 'moon-phase-viewer':
      return <MoonPhaseViewer />;
    case 'time-zone-converter':
      return <TimeZoneConverter />;
    case 'utm-builder':
      return <UTMBuilder />;
    case 'meta-tag-generator':
      return <MetaTagGenerator />;
    case 'ab-test-significance-calculator':
      return <ABTestSignificanceCalculator />;
    case 'ctr-calculator':
      return <CTRCalculator />;
    case 'roi-calculator-marketing':
      return <MarketingROICalculator />;
    case 'engagement-rate-calculator':
      return <EngagementRateCalculator />;
    case 'keyword-density-analyzer':
      return <KeywordDensityAnalyzer />;
    case 'slug-generator':
      return <SlugGenerator />;
    case 'invoice-generator':
      return <InvoiceGenerator />;
    case 'receipt-maker':
      return <ReceiptMaker />;
    case 'expense-report-generator':
      return <ExpenseReport />;
    case 'timesheet-generator':
      return <TimesheetGenerator />;
    case 'work-schedule-maker':
      return <WorkScheduleMaker />;
    case 'quotation-generator':
      return <QuotationGenerator />;
    case 'purchase-order-generator':
      return <PurchaseOrderGenerator />;
    case 'meeting-minutes-generator':
      return <MeetingMinutes />;
    case 'business-card-maker':
      return <BusinessCardMaker />;
    case 'qr-generator':
      return <QRGenerator />;
    case 'color-palette-generator':
      return <ColorPaletteGenerator />;
    case 'css-gradient-generator':
      return <GradientGenerator />;
    case 'glassmorphism-generator':
      return <GlassmorphismGenerator />;
    case 'pattern-generator':
      return <PatternGenerator />;
    case 'blob-generator':
      return <BlobGenerator />;
    case 'neumorphism-generator':
      return <NeumorphismGenerator />;
    case 'box-shadow-generator':
      return <BoxShadowGenerator />;
    case 'border-radius-generator':
      return <BorderRadiusGenerator />;
    case 'spacing-grid-generator':
      return <SpacingGridGenerator />;
    case 'base64-converter':
      return <Base64Converter />;
    case 'regex-tester':
      return <RegexTester />;
    case 'uuid-generator':
      return <UUIDGenerator />;
    case 'number-base-converter':
      return <NumberBaseConverter />;
    case 'jwt-decoder':
      return <JWTDecoder />;
    case 'html-encoder-decoder':
      return <HtmlEncoderDecoder />;
    case 'url-encoder-decoder':
      return <UrlEncoderDecoder />;
    case 'hex-rgb-converter':
      return <HexRgbConverter />;
    case 'user-agent-parser':
      return <UserAgentParser />;
    default:
      return (
        <div className="text-center text-muted-foreground py-10">
          Tool not found or not yet implemented.
        </div>
      );
  }
};

function getToolDescription(tool: string): string {
  const descriptions: Record<string, string> = {
    'case-converter': 'Convert text to uppercase, lowercase, capitalized, or sentence case.',
    'find-replace-tool': 'Find and replace words or phrases in your text content.',
    'line-counter': 'Count total lines in a block of text.',
    'list-sorter': 'Sort lines in a list alphabetically or numerically.',
    'reading-time-estimator': 'Estimate how long it takes to read your text.',
    'text-cleaner': 'Remove special characters, extra spaces, or formatting from text.',
    'text-randomizer': 'Shuffle words or lines randomly.',
    'text-reverser': 'Reverse entire text, lines, or words.',
    'password-generator': 'Generate secure, customizable passwords for your accounts',
    'qr-generator': 'Create QR codes for URLs, text, contact info and more',
    'color-palette': 'Explore and create beautiful color palettes for your designs',
    'hash-generator': 'Generate cryptographic hashes from your input text',
    'json-formatter': 'Format and validate JSON data with syntax highlighting',
    'base64-converter': 'Encode and decode text in Base64 format',
    'regex-tester': 'Test regular expressions with live matching',
    'uuid-generator': 'Create v4 UUIDs',
    'number-base-converter': 'Convert between binary, decimal, octal, and hex',
    'jwt-decoder': 'Decode header & payload (no verification)',
    'html-encoder-decoder': 'Encode/decode HTML entities',
    'url-encoder-decoder': 'URI encode/decode tool',
    'hex-rgb-converter': 'Convert color codes between HEX and RGB formats',
    'user-agent-parser': 'Parse browser UA strings into readable format',
    'compound-interest-calculator': 'Calculate how your investments grow over time',
    'utm-builder': 'Generate trackable URLs with customizable UTM parameters',
    'meta-tag-generator': 'Create SEO/meta tags (Open Graph, Twitter Cards, etc.)',
    'ab-test-significance-calculator': 'Calculate p-value, confidence interval, conversion rates, and test result significance with emoji feedback and graph.',
    'ctr-calculator': 'Calculate Click-Through Rate with emoji feedback and performance gauge chart.',
    'roi-calculator-marketing': 'Calculate ROI from revenue and cost. Includes chart view of profit/loss.',
    'engagement-rate-calculator': 'Social media ER calculator with auto emoji quality scale.',
    'keyword-density-analyzer': 'Analyze keywords from content for SEO; visualize with bar chart.',
    'slug-generator': 'Convert titles/headlines into SEO-friendly slugs with real-time preview.',
    'roi-calculator': 'Measure return on investment for your business projects',
    'loan-emi-calculator': 'Calculate monthly payments for your loans',
    'simple-interest-calculator': 'Calculate simple interest on principal amount',
    'investment-return-calculator': 'Project future value of your investments',
    'retirement-corpus-calculator': 'Plan your retirement savings goal',
    'tax-calculator': 'Estimate your income tax liabilities',
    'break-even-point-calculator': 'Determine when your business becomes profitable',
    'percentage-calculator': 'Calculate percentages, increases and decreases',
    'currency-conversion': 'Convert between world currencies with live rates',
    'savings-goal-calculator': 'Plan how to reach your financial goals',
    'lorem-ipsum-generator': 'Generate placeholder text for your designs',
    'word-counter': 'Count words, characters and reading time in your text',
    'date-calculator': 'Add/subtract days, weekdays only mode, export result, calendar picker',
    'age-calculator': 'Live age counter (updates every second), emoji age badges, shareable result',
    'world-clock': 'Animated city cards, flags 🇺🇸🇬🇧🇯🇵, search bar, 12/24hr toggle',
    'countdown-timer': 'Themeable countdowns, end-time alert sound, Lottie finish animation',
    'stopwatch': 'Lap tracker with animated timeline, sound effects, keyboard shortcuts',
    'pomodoro-timer': 'Work/break cycles, stats summary popup, dark mode 🌙 support',
    'day-finder': 'Fun facts for selected day (e.g., famous birthdays), emoji for weekday',
    'moon-phase-viewer': 'Animated moon visual with sliding calendar, zodiac emoji 🌕♈',
    'time-zone-converter': 'Select two zones & compare live clocks, animated arcs between zones',
    'bmi-calculator': 'Calculate your Body Mass Index with health category indicators',
    'unit-converter': 'Convert between different units of measurement',
    'area-calculator': 'Calculate area for various geometric shapes',
    'scientific-calculator': 'Advanced calculator with scientific functions',
    'volume-calculator': 'Calculate volume for 3D shapes and containers',
    'triangle-solver': 'Solve for unknown sides/angles of triangles',
    'ohms-law-calculator': 'Calculate voltage, current, resistance using Ohm\'s Law',
    'snr-calculator': 'Calculate signal-to-noise ratio for audio/electronic systems',
    'frequency-wavelength-converter': 'Convert between frequency and wavelength',
    'invoice-generator': 'Professional invoice generator with customizable templates',
    'receipt-maker': 'Create receipts for transactions with company branding',
    'expense-report-generator': 'Generate detailed expense reports for reimbursement',
    'timesheet-generator': 'Create timesheets for employee time tracking',
    'work-schedule-maker': 'Plan and generate work schedules for teams',
    'quotation-generator': 'Create professional quotes for clients',
    'purchase-order-generator': 'Generate purchase orders for vendors',
    'meeting-minutes-generator': 'Document meeting details and action items',
    'business-card-maker': 'Design professional business cards',
  };
  
  return descriptions[tool] || 'A useful tool to help with your tasks';
}

export const ToolsPage = () => {
  const { slug } = useParams();
  const { user, profile } = useAuth();
  const location = useLocation();

  // Scroll to top whenever the slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleToolClick = (e: React.MouseEvent, tool: string) => {

    if (!user) {
      e.preventDefault();
      toast.dismiss();
      toast.error('Please sign in to access this tool', {
        style: {
          background: '#dc2626', // red-600
          color: 'white',
        },
      });
      return;
    }


    const premiumTools = [
      'tax-calculator',
      'currency-conversion',
      'loan-emi-calculator',
      'countdown-timer',
      'pomodoro-timer',
      'day-finder',
      'moon-phase-viewer',
      'scientific-calculator',
      'bmi-calculator',
      'unit-converter',
      'reading-time-estimator',
      'text-cleaner',
      'list-sorter',
      'find-replace-tool',
      'qr-generator',
      'glassmorphism-generator',
      'pattern-generator',
      'regex-tester',
      'jwt-decoder',
      'number-base-converter',
      'user-agent-parser',
      'ab-test-significance-calculator',
      'ctr-calculator',
      'roi-calculator-marketing',
      'engagement-rate-calculator',
      'keyword-density-analyzer',
      'expense-report-generator',
      'timesheet-generator',
      'work-schedule-maker',
      'purchase-order-generator',
      'invoice-generator',
      'business-card-maker'
    ];

    if (premiumTools.includes(tool) && !profile?.is_premium) {
      e.preventDefault();
      toast.dismiss();
      toast.error('Upgrade to premium to access this tool', { className: 'bg-red-500 text-white' });
      setTimeout(() => {
        window.location.href = '/pricing';
      });
    }
  };

  const renderContent = () => {
    const isTool = categories.some(cat => cat.tools.includes(slug || ''));
    const isCategory = categories.some(cat => cat.title.toLowerCase().replace(/\s/g, '-') === slug);

    if (slug && isTool) {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ToolDisplay slug={slug} />
        </div>
      );
    } else if (slug && isCategory) {
      const selectedCategory = categories.find(
        (cat) => cat.title.toLowerCase().replace(/\s/g, '-') === slug
      );

      if (selectedCategory) {
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {selectedCategory.title === "Financial" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
              <h2 className="text-4xl font-bold text-foreground mb-3">
              <span className="text-emerald-600">💰 Financial Tools</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                All Financial Tools at one place
              </p>
            </motion.div>
            ) : selectedCategory.title === "Date & Time" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
              <h2 className="text-4xl font-bold text-foreground mb-3">
              <span className="text-blue-600">⏰ Date & Time Tools</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                All Date & Time Tools at one place
              </p>
             </motion.div>
             ) : selectedCategory.title === "Math" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
              <h2 className="text-4xl font-bold text-foreground mb-3">
              <span className="text-purple-600">🧮 Math Tools</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Powerful calculators and converters for math problems
              </p>
             </motion.div>
             ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {selectedCategory.title}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {selectedCategory.description}
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedCategory.tools.map((tool) => {
                const premiumTools = [
                  'tax-calculator',
                  'currency-conversion',
                  'loan-emi-calculator',
                  'countdown-timer',
                  'pomodoro-timer',
                  'day-finder',
                  'moon-phase-viewer',
                  'scientific-calculator',
                  'bmi-calculator',
                  'unit-converter',
                  'reading-time-estimator',
                  'text-cleaner',
                  'list-sorter',
                  'find-replace-tool',
                  'qr-generator',
                  'glassmorphism-generator',
                  'pattern-generator',
                  'regex-tester',
                  'jwt-decoder',
                  'number-base-converter',
                  'user-agent-parser',
                  'ab-test-significance-calculator',
                  'ctr-calculator',
                  'roi-calculator-marketing',
                  'engagement-rate-calculator',
                  'keyword-density-analyzer',
                  'expense-report-generator',
                  'timesheet-generator',
                  'work-schedule-maker',
                  'purchase-order-generator',
                  'invoice-generator',
                  'business-card-maker'
                ];
                const isPremiumTool = premiumTools.includes(tool);
                const isLocked = isPremiumTool && !profile?.is_premium;
                
                return (
                  <motion.div
                    key={tool}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                      <div className={`relative h-full flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${isLocked ? 'border-yellow-400/30' : 'border-primary'}`}>
                      {/* Premium crown badge with constant glow */}
                      {isPremiumTool && profile?.is_premium && (
                        <div className="absolute top-3 right-3">
                          <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-[8px]"></div>
                            {/* Crown with gradient */}
                            <div className="relative bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 text-amber-900 p-1.5 rounded-full shadow-[0_0_12px_2px_rgba(251,191,36,0.6)]">
                              <Crown className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-lg ${isLocked ? 'bg-yellow-400/10 text-yellow-500' : 'bg-primary/10 text-primary'}`}>
                            {toolIcons[tool] || <Sparkles className="h-5 w-5" />}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground capitalize">
                            {tool.replace(/-/g, ' ')}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-5">
                          {getToolDescription(tool)}
                        </p>
                      </div>
                      
                      <div className="px-5 pb-5">
                        <Link
                          to={`/${tool}`}
                          onClick={(e) => handleToolClick(e, tool)}
                          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${isLocked 
                            ? 'bg-yellow-400/10 text-yellow-500 border border-yellow-400/30 hover:bg-yellow-400/20' 
                            : 'bg-green-500 hover:bg-green-600 text-white'}`}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="h-4 w-4" />
                              <span>Premium</span>
                            </>
                          ) : (
                            <>
                              <span>Use Tool</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Link>
                      </div>
                      
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                          <div className="bg-yellow-400/90 text-yellow-900 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Premium
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      } else {
        return (
          <div className="text-center text-muted-foreground py-10">
            Category not found.
          </div>
        );
      }
    } else {
      return <ToolCategories />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      <main className="flex-grow w-full">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};