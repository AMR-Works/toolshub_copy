
import React, { useState } from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePolar } from "@/hooks/usePolar";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/hooks/usePremium";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CountrySelector, countries, type CountryData } from '@/components/CountrySelector';

const getPlansForCountry = (countryData: CountryData) => {
  // Calculate final price including taxes
  const finalPrice = Math.floor(countryData.basePrice * (1 + countryData.taxRate)) + 0.99;
  
  return [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      icon: Star,
      popular: false,
      features: [
        'Access to limited tools',
        'Only 1 usage per day',
        'No exports',
        'No data storage',
        'Community support'
      ],
      limitations: []
    },
    {
      name: 'Pro',
      price: { 
        monthly: finalPrice, 
        annual: Math.floor(finalPrice * 10 * 0.8) + 0.99 // 20% discount, rounded to .99
      },
      description: 'For power users and professionals',
      icon: Crown,
      popular: true,
      features: [
        'Access to all tools',
        'Unlimited usage',
        'Full export capabilities',
        'Data storage included',
        'Priority support',
        'Advanced features',
        `All taxes (${countryData.taxName}) included`
      ],
      limitations: []
    }
  ];
};

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const { openCheckout, loading } = usePolar();
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  const countryData = countries.find(c => c.code === selectedCountry) || countries[0];
  const plans = getPlansForCountry(countryData);

  const handlePlanSelect = async (plan: any) => {
    if (plan.name === "Free") {
      return;
    }

    if (!user) {
      navigate('/auth');
      return;
    }

    if (isPremium) {
      toast.success("You're already a premium user!");
      return;
    }

    // Use Polar.sh checkout with price ID
    const priceId = isAnnual ? 'price_annual_pro' : 'price_monthly_pro';
    await openCheckout(
      priceId,
      () => {
        toast.success("Welcome to Premium!");
        navigate('/profile');
      },
      (error) => {
        toast.error(`Payment failed: ${error}`);
      }
    );
  };

  const getButtonText = (plan: any) => {
    if (plan.name === "Free") {
      return isPremium ? "Downgrade" : "Current Plan";
    }
    if (isPremium) {
      return "Current Plan";
    }
    return user ? "Upgrade to Pro" : "Sign Up for Pro";
  };

  return (
    <section id="pricing" className="relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-foreground">
            Simple, Transparent
            <br />
            <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>

          {/* Country Selector */}
          <div className="max-w-md mx-auto mb-8">
            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-card border border-border rounded-2xl p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                !isAnnual 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-xl transition-all duration-200 relative ${
                isAnnual 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            
            return (
              <div
                key={plan.name}
                className={`relative bg-card border rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-primary shadow-2xl shadow-primary/10 ring-1 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-primary shadow-lg shadow-primary/25' 
                      : 'bg-muted'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${plan.popular ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  
                   <div className="mb-6">
                     <span className="text-4xl font-bold text-foreground">{countryData.symbol}{price}</span>
                     {price > 0 && (
                       <span className="text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
                     )}
                     {price > 0 && (
                       <div className="text-xs text-muted-foreground mt-1">
                         Includes {countryData.taxName} ({(countryData.taxRate * 100).toFixed(0)}%)
                       </div>
                     )}
                   </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-start opacity-60">
                      <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0">
                        <div className="w-3 h-3 bg-muted-foreground rounded-full mt-1"></div>
                      </div>
                      <span className="text-muted-foreground text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loading || (plan.name === "Free" && !isPremium) || (plan.name === "Pro" && isPremium)}
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full py-4 text-lg font-medium"
                >
                  {getButtonText(plan)}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};
