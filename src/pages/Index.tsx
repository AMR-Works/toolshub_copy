
import React, { memo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

// Lazy load components
const Hero = React.lazy(() => import('@/components/Hero').then(module => ({
  default: module.Hero
})));
const ToolCategories = React.lazy(() => import('@/components/ToolCategories').then(module => ({
  default: module.ToolCategories
})));
const PricingSection = React.lazy(() => import('@/components/PricingSection').then(module => ({
  default: module.PricingSection
})));

// Memoize components that don't change often
const MemoizedNavigation = memo((props: React.ComponentProps<typeof Navigation>) => (
  <Navigation {...props} />
));

const MemoizedFooter = memo((props: React.ComponentProps<typeof Footer>) => (
  <Footer {...props} />
));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-screen">
        <MemoizedNavigation className="sticky top-0 z-50 bg-background border-b border-border" />
        <Hero />
        <MemoizedFooter className="border-t border-border" />
      </div>
    </div>
  );
};

export default Index;
