import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';

const LandingPage = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const { user } = useAuth();
  const { isPremium } = usePremium();

  useEffect(() => {
    // Add bubbles animation
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 60 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      document.getElementById('bubbles-container')?.appendChild(bubble);
      setTimeout(() => bubble.remove(), 4000);
    };

    const interval = setInterval(createBubble, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <Navigation />
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-10 sm:pt-32 sm:pb-12 lg:pt-40 lg:pb-16" id="hero">
        <div className="absolute inset-0 overflow-hidden">
          <div id="bubbles-container" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                <span className="block">Your All-in-One</span>
                <span className="block text-primary">Web Tools Collection</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                50+ powerful tools that run completely in your browser. No server processing, no data leaks, just pure client-side magic.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/tools"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Explore Tools
                  </Link>
                  {!isPremium && (
                    <Link
                       to="/pricing"
                       className="inline-flex items-center justify-center px-8 py-3 border border-primary text-base font-medium rounded-md text-accent bg-background hover:bg-white md:py-4 md:text-lg md:px-10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                     >
                      Go Pro
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Tool Categories Grid */}
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full  lg:max-w-md">
                <div className="relative w-full h-96 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 p-6">
                      {[
                        { icon: '🧮', label: 'Calculators' },
                        { icon: '💻', label: 'Dev Tools' },
                        { icon: '🎨', label: 'Design' },
                        { icon: '📄', label: 'Documents' },
                        { icon: '🔄', label: 'Converters' },
                        { icon: '🔑', label: 'Generators' }
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="animate-float"
                          style={{ animationDelay: `${index * 0.5}s` }}
                        >
                          <div className="bg-transparent rounded-full p-4 flex flex-col items-center justify-center h-24 w-24 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                            <span className="text-3xl mb-2">{item.icon}</span>
                            <span className="text-xs font-medium text-foreground">{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-10 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
              Why choose ToolsHub?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-primary/80 lg:mx-auto">
                All the benefits, none of the drawbacks.
              </p>
            </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[{
                  icon: '🔒',
                  title: 'No Ads',
                  description: 'Enjoy a clean, distraction-free experience – your focus comes first.'
                },
                {
                  icon: '⚡',
                  title: 'Instant Results',
                  description: 'Tools run smoothly and instantly right in your browser – no delays, no loading screens.'
                },
                {
                  icon: '🌙',
                  title: 'Dark Mode',
                  description: 'A sleek dark theme is available in the Pro plan for comfortable late-night sessions.'
                },
                {
                  icon: '💾',
                  title: 'Save Favorites',
                  description: 'Pro users can bookmark favorite tools and access them across all devices.'
                },
                {
                  icon: '📤',
                  title: 'Export Results',
                  description: 'Easily download your results in multiple formats for later use.'
                },
                {
                  icon: '🔁',
                  title: 'Unlimited Usage',
                  description: 'Use any tool, any number of times – no hidden limits.'
                },
                {
                  icon: '🛡️',
                  title: 'Your Data Is Always Protected',
                  description: 'All tools run locally in your browser – nothing is uploaded or stored on servers.'
                },
                {
                  icon: '🧠',
                  title: 'Simple & Intuitive',
                  description: 'Every tool is designed to be easy to use, even for beginners.'
                }
              ].map((feature, index) => (
                <div key={feature.title} className="relative animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-transparent text-primary border border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-110">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-foreground">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>






      {/* CTA Section */}
      <div className="bg-background">
        <div className="max-w-2xl mx-auto text-center py-10 px-4 sm:py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            <span className="block">Ready to boost your productivity?</span>
            <span className="block">Start using ToolsHub today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-muted-foreground">
            Join thousands of developers, designers, and professionals who trust ToolsHub for their daily tasks.
          </p>
          {user ? (
            <Link
              to="/tools"
              onClick={() => window.scrollTo(0, 0)}
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Explore Tools
            </Link>
          ) : (
            <Link
              to="/auth"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Get Started for Free
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;