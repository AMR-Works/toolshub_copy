import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const PrivacyPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to Tool Hub. We value your privacy and are committed to safeguarding your personal information.
            This Privacy Policy outlines how we collect, use, and protect your data when you use our website and services.
            By accessing or using Tool Hub, you agree to the practices described here. If you disagree, please do not use the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information to improve your experience, provide relevant features, and maintain site security. Information may include:
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Personal Data</h3>
          <p className="text-muted-foreground">
            Details you voluntarily provide — such as your name, email, address, phone number, or demographic details — when registering, contacting us, or engaging with site features like chat or feedback forms.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Derivative Data</h3>
          <p className="text-muted-foreground">
            Technical information automatically collected from your browser or device — including IP address, browser type, device info, pages visited, and access timestamps.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground">
            Your information allows us to offer a better experience, personalized services, and platform improvements. We may use your data to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mt-2">
            <li>Create, manage, and secure your account</li>
            <li>Respond to your inquiries or provide updates</li>
            <li>Personalize your user experience</li>
            <li>Monitor traffic and usage patterns</li>
            <li>Improve site performance and offerings</li>
            <li>Send newsletters, updates, or promotions (if opted in)</li>
            <li>Enable user-to-user interactions</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">When We Share Information</h2>
          <p className="text-muted-foreground">
            We respect your privacy and only share your information in limited scenarios:
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Legal Compliance</h3>
          <p className="text-muted-foreground">
            If required by law, regulation, court order, or to protect our rights or users' safety, we may disclose your information.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Third-Party Service Providers</h3>
          <p className="text-muted-foreground">
            We may engage trusted partners to perform services like hosting, analytics, customer support, or email delivery. These partners only access data needed for their work and are bound by confidentiality agreements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Protect Your Information</h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures — including encryption, firewalls, and access controls — to protect your personal data. However, no method of internet transmission or electronic storage is 100% secure. Use the site at your discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions, concerns, or requests regarding your data or this policy, please reach out to us at:{' '}
            <a href="mailto:keepknowing583@gmail.com" className="text-blue-500 underline">
              Mail
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
