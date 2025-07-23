import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
          <p className="text-muted-foreground">
            Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit — like your preferences or login state — and improve both performance and user experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <p className="text-muted-foreground mb-2">
            Tool Hub uses cookies for a variety of reasons to enhance your experience. These include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Required for core site functionality, such as page navigation or secure login.
            </li>
            <li>
              <strong>Performance & Functionality Cookies:</strong> Improve usability and enhance features. These are optional but improve your experience.
            </li>
            <li>
              <strong>Analytics & Customization Cookies:</strong> Help us understand how users interact with our site so we can improve it over time.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> Used to deliver personalized content and targeted ads based on your activity and preferences.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Cookie Choices</h2>
          <p className="text-muted-foreground">
            You can control or delete cookies at any time. Most browsers allow you to manage cookie settings — including blocking or deleting cookies. Please note that disabling cookies may impact your ability to use certain features on our website.
          </p>
          <p className="text-muted-foreground mt-4">
            You can also review or adjust your cookie preferences via our cookie banner when you first visit the site or by clearing cookies and reloading the page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">More Information</h2>
          <p className="text-muted-foreground">
            If you have questions about how we use cookies or manage your data, feel free to reach out at:{' '}
            <a
              href="mailto:keepknowing583@gmail.com"
              className="text-blue-500 underline"
            >
              Mail
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;
