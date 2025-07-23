import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const TermsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using Tool Hub (the “Service”), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, please do not use the website. All content and materials are protected under applicable copyright and trademark laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-muted-foreground">
            We grant you a limited, non-exclusive license to temporarily download one copy of materials (text, tools, or software) for personal, non-commercial use only. Under this license, you may not:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
            <li>Modify, distribute, or copy the materials</li>
            <li>Use them for any commercial purpose or public display</li>
            <li>Reverse engineer or decompile any software from Tool Hub</li>
            <li>Remove copyright or proprietary notations</li>
            <li>Mirror or repost materials on other servers</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            This license will automatically terminate if you violate these restrictions, and Tool Hub may revoke it at any time. Upon termination, you must destroy any downloaded materials in your possession.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-muted-foreground">
            All materials and services are provided "as is." Tool Hub makes no warranties—express or implied—and disclaims all warranties, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p className="text-muted-foreground mt-4">
            Tool Hub does not guarantee the accuracy or reliability of results from using the site or content found on any linked third-party site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="text-muted-foreground">
            In no event shall Tool Hub or its suppliers be liable for any damages—including, but not limited to, data loss, business interruption, or financial losses—arising from the use or inability to use materials on this site. These limitations may not apply where prohibited by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Information</h2>
          <p className="text-muted-foreground">
            The content on Tool Hub may contain technical, typographical, or photographic errors. While we aim for accuracy, we do not guarantee that all materials are complete or current. Updates may be made at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. External Links</h2>
          <p className="text-muted-foreground">
            Tool Hub may link to external sites for convenience. We do not review or endorse the content of these sites and are not responsible for any damages resulting from their use. Accessing third-party websites is at your own risk.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="text-muted-foreground">
            Tool Hub reserves the right to modify these Terms at any time. Continued use of the site constitutes your acceptance of any revised terms. Please review this page periodically for updates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms are governed by the laws of India. By using the site, you consent to the jurisdiction of courts located in India for any disputes.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
