import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Crown as CrownIcon, Star, Zap, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { countries } from '@/components/CountrySelector';
import type { CountryData } from '@/components/CountrySelector';
import React, { useState, useEffect, useMemo } from 'react';
import { usePolar } from '@/hooks/usePolar';

const CountrySelector = React.lazy(() => import('@/components/CountrySelector').then(module => ({
  default: module.CountrySelector
})));

const getPlansForCountry = (countryData: CountryData) => {
  const calculatePrice = (base: number) => parseFloat((base * (1 + countryData.taxRate)).toFixed(2));

  const monthlyPrice = calculatePrice(countryData.basePrice);
  const annualPrice = parseFloat((monthlyPrice * 9.6).toFixed(2));
  
  return [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Experience the essentials at no cost',
      icon: Star,
      popular: false,
      features: [
        'Access to 20+ essential tools',
        'Standard calculations',
        '1 usage per day',
        'No data export',
        'No saving of data',
        'No bookmarking'
      ]
    },
    {
      name: 'Pro',
      price: {
        monthly: monthlyPrice,
        annual: annualPrice
      },
      description: 'Unlock the full potential with premium features',
      icon: CrownIcon,
      popular: true,
      features: [
        'Unlimited usage without restrictions',
        'Access to 50+ advanced tools',
        'Export data effortlessly',
        'Save your data securely',
        'Bookmark favorite tools for quick access',
        'Enjoy a sleek Dark Mode',
        'Get early access to newly released tools',
        `All taxes (${countryData.taxName}) included`
      ]
    }
  ];
};

import { Footer } from '@/components/Footer';
import { usePremium } from '@/hooks/usePremium';
import { useAuth } from '@/contexts/AuthContext';

const PricingPage = () => {
  const { isPremium } = usePremium();
  const { user, profile } = useAuth();
  const { openCheckout, loading } = usePolar();
  const navigate = useNavigate();

  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#payment-faqs') {
      const element = document.getElementById('payment-faqs');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  const [selectedCountry, setSelectedCountry] = useState('US');
  const [processingPayment, setProcessingPayment] = useState(false);

  const countryData = countries.find(c => c.code === selectedCountry) || countries[0];
  const plans = useMemo(() => getPlansForCountry(countryData), [countryData]);

  const handlePlanSelect = async (plan: any) => {
    if (plan.name === "Free" || isPremium) {
      return;
    }

    if (!user) {
      navigate('/auth');
      return;
    }

    setProcessingPayment(true);
    const priceId = isAnnual ? 'price_annual_pro' : 'price_monthly_pro';
    
    try {
      await openCheckout(
        priceId,
        () => {
          toast.success("Payment successful! Welcome to Premium!");
          navigate('/profile');
        },
        (error) => {
          toast.error(`Payment failed: ${error}`);
        }
      );
    } catch (error) {
      toast.error('Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getButtonText = (plan: any) => {
    if (plan.name === "Free") {
      return isPremium ? "Current Free Features" : "Current Plan";
    }
    if (!user) {
      return "Sign in to access Pro";
    }
    if (isPremium) {
      return "✓ You Have Premium";
    }
    return "Select Plan";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8">
        {user && isPremium ? (
          <div>
            <div className="max-w-2xl mx-auto text-center mb-8">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                    <CrownIcon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-yellow-800">
                    You're Already Premium!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4">
                    <div className="text-sm text-yellow-700">
                      Now you can enjoy:
                      <ul className="mt-2 text-left mx-auto max-w-xs space-y-1">
                        <li><Check className="h-4 w-4 inline-block text-green-500 mr-1" />Unlimited usage without restrictions</li>
                        <li><Check className="h-4 w-4 inline-block text-green-500 mr-1" />Access to 50+ tools</li>
                        <li><Check className="h-4 w-4 inline-block text-green-500 mr-1" />Export data effortlessly</li>
                        <li><Check className="h-4 w-4 inline-block text-green-500 mr-1" />Save your data securely</li>
                        <li><Check className="h-4 w-4 inline-block text-green-500 mr-1" />Bookmark favorite tools for quick access</li>
                        <li><Check className="h-4 w-4 inline-block text-green-500 mr-1" />Enjoy a sleek Dark Mode</li>
                        <li><Check className="h-4 w-4 inline-block text-green-500 mr-1" />Get early access to newly released tools</li>
                      </ul>
                    </div>
                    <Link to="/profile">
                      <Button className="bg-yellow-600 hover:bg-yellow-700 mt-2">
                        View Profile
                      </Button>
                    </Link>
                    <p className="text-2xl font-bold text-orange-500 mt-2">Thanks for choosing Premium! 😊</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-1">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Clear Plans, No Surprises
                </h1>
                <p className="mt-4 text-2xl text-muted-foreground">
                  Pick the perfect plan to match your needs and budget.
                </p>
              </div>

              {/* Updated section with country selector on left and billing toggle on right */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-4 gap-4">
                {/* Country Selector */}
                <div className="w-full md:w-1/2">
                  <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-2">Select Your Country</h2>
                  <React.Suspense fallback={<div>Loading countries...</div>}>
                    <CountrySelector
                      selectedCountry={selectedCountry}
                      onCountryChange={setSelectedCountry}
                    />
                  </React.Suspense>
                </div>

                {/* Toggle Buttons */}
                <div className="w-full md:w-1/2 flex justify-start md:justify-end mt-2 md:mt-5">
                  <div className="inline-flex rounded-lg bg-muted p-1">
                    <button
                      onClick={() => setIsAnnual(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${!isAnnual ? 'bg-background text-foreground shadow' : 'text-muted-foreground'}`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setIsAnnual(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${isAnnual ? 'bg-background text-foreground shadow' : 'text-muted-foreground'}`}
                    >
                      Annually
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-green-600 text-white rounded-full">
                        20% OFF
                      </span>
                    </button>
                  </div>
                </div>
              </div>



              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-stretch">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`flex flex-col ${plan.popular ? 'border-2 border-primary shadow-lg' : 'border border-border'}`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                        {plan.popular && (
                          <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                        )}
                      </div>
                      <div>
                        <CardDescription className="mt-2 text-muted-foreground">
                          {plan.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <div className="flex items-baseline mt-4">
                        <span className="text-5xl font-extrabold tracking-tight">
                          {countryData.symbol}{(isAnnual ? plan.price.annual : plan.price.monthly).toFixed(2)}
                        </span>
                        <span className="ml-1 text-xl font-semibold text-muted-foreground">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      </div>
                      <ul role="list" className="mt-8 space-y-4 flex-grow">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500" />
                            <span className="ml-3 text-muted-foreground">{feature}</span>
                          </li>
                        ))} 
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button
                        className="w-full"
                        onClick={() => handlePlanSelect(plan)}
                        disabled={processingPayment || (plan.name === "Free" && isPremium)}
                      >
                        {getButtonText(plan)}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="payment-faqs" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Payments – Frequently Asked Questions (FAQs)</h2>
            <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Find answers to common questions about our payment process and premium plans.
            </p>
          </div>
          <div className="mt-10 mx-auto max-w-2xl space-y-6">
            <h3 className="text-xl font-semibold">Core Payment FAQs</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">1. Is my payment information secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, your payment is processed through industry-standard secure gateways. Your data is protected with advanced encryption and privacy protocols.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">2. Do you store my card or payment details?</AccordionTrigger>
                <AccordionContent>
                  No, storing your card details is entirely optional and handled securely via our payment partner.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">3. When will I be charged?</AccordionTrigger>
                <AccordionContent>
                  Payment is deducted immediately upon confirmation, and your premium access will be activated instantly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">4. How do I upgrade, downgrade, or cancel my subscription?</AccordionTrigger>
                <AccordionContent>
                  You can upgrade anytime. Downgrading is not available during an active plan. Plan changes can be made after your current plan expires. Please note: all payments are non-refundable.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">5. What happens if my payment fails?</AccordionTrigger>
                <AccordionContent>
                  If the payment fails but money is deducted from your account, please contact us at <a className="text-blue-500 hover:underline" href="mailto:keepknowing583@gmail.com">keepknowing583@gmail.com</a> and share the transaction details. We will assist you promptly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">6. Can I get a refund?</AccordionTrigger>
                <AccordionContent>
                  No. All payments made are non-refundable.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">7. Do you offer free trials or discounts?</AccordionTrigger>
                <AccordionContent>
                  No, we currently do not offer any free trials or discounts on individual plans.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <h3 className="text-xl font-semibold mt-8">International & Currency FAQs</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-8">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">8. Can I pay in my local currency?</AccordionTrigger>
                <AccordionContent>
                  Currently, we accept payments only via international or domestic cards. Currency conversion may be handled by your bank.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-9">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">9. Are there any additional fees or taxes?</AccordionTrigger>
                <AccordionContent>
                  No hidden charges. All applicable taxes are included in the displayed pricing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <h3 className="text-xl font-semibold mt-8">Advanced & Team Plans</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-10">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">10. Can I make bulk payments or team purchases?</AccordionTrigger>
                <AccordionContent>
                  Yes! For team plans (minimum 20 members), please email us at <a className="text-blue-500 hover:underline" href="mailto:keepknowing583@gmail.com">keepknowing583@gmail.com</a> for custom pricing and discounts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-11">
                <AccordionTrigger className="flex justify-between items-center w-full py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)]">11. Can I use multiple payment methods for a single order?</AccordionTrigger>
                <AccordionContent>
                  No, each order can only be completed using one payment method.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PricingPage;