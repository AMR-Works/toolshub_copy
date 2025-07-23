import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">About ToolHub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A fresh approach to online tools - launched in 2025 to simplify your digital workflow
          </p>
        </div>

        <section className="mb-16 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Beginning</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              ToolHub was launched in early 2025 with a simple goal: to create a cleaner, faster, and more reliable alternative to existing online tools. Unlike many tool websites cluttered with ads and trackers, we're building something different.
            </p>
            <p>
              As a brand new platform, we're starting with carefully selected essential tools and plan to grow based on real user feedback. Every tool is built with modern web standards to ensure speed, privacy, and accuracy.
            </p>
            <p>
              We're currently a small dedicated team working to establish ToolHub as your go-to resource for everyday digital tools.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">What Makes ToolHub Different</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-muted-foreground">
                Most tools work entirely in your browser. We minimize data collection and don't sell your information.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Built with modern web technologies for instant results without page reloads.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🧹</div>
              <h3 className="text-xl font-semibold mb-3">No Clutter</h3>
              <p className="text-muted-foreground">
                Clean interfaces without distracting ads or unnecessary features.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Growing Collection</h2>
          <p className="text-muted-foreground mb-6">
            We're carefully adding new tools based on what users actually need. Current categories include:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Developer Tools</h3>
              <p className="text-muted-foreground text-sm">Formatters, encoders, hash generators</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Text Utilities</h3>
              <p className="text-muted-foreground text-sm">Counters, converters, case changers</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Calculators</h3>
              <p className="text-muted-foreground text-sm">Basic, scientific, and converters</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Generators</h3>
              <p className="text-muted-foreground text-sm">Random data, passwords, IDs</p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-blue-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Technology</h2>
          <p className="text-muted-foreground mb-6">
            We use modern web standards to ensure our tools work reliably across all devices:
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white px-4 py-2 rounded-lg text-sm">React</span>
            <span className="bg-white px-4 py-2 rounded-lg text-sm">Next.js</span>
            <span className="bg-white px-4 py-2 rounded-lg text-sm">TypeScript</span>
            <span className="bg-white px-4 py-2 rounded-lg text-sm">Tailwind CSS</span>
            <span className="bg-white px-4 py-2 rounded-lg text-sm">Web Workers</span>
            <span className="bg-white px-4 py-2 rounded-lg text-sm">Service Workers</span>
          </div>
        </section>

        <section className="mb-16 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Roadmap</h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                Q2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2025 Launch Phase</h3>
                <p className="text-muted-foreground">
                  Core toolset establishment, initial user feedback collection, performance optimization
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                Q3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Feature Expansion</h3>
                <p className="text-muted-foreground">
                  Adding most-requested tools, browser extension development, mobile optimization
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                Q4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Community Growth</h3>
                <p className="text-muted-foreground">
                  User accounts, tool customization, API access for developers
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Get Involved</h2>
          <p className="text-muted-foreground mb-6">
            As a new platform, we value your feedback and suggestions. Help shape ToolHub's future:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Suggest a Tool</h3>
              <p className="text-muted-foreground mb-4">
                Tell us what tools you need and we'll prioritize development.
              </p>
              <a 
                href="mailto:suggestions@toolhub.com" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Email Suggestions
              </a>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Report Issues</h3>
              <p className="text-muted-foreground mb-4">
                Found a bug or have a technical concern? Let us know.
              </p>
              <a 
                href="mailto:support@toolhub.com" 
                className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;