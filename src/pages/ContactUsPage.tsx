import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, MapPin, Linkedin } from 'lucide-react';
import DiscordIcon from '../../discord.svg';

const ContactUsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions (FAQs)</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqList.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="py-4 font-medium text-left text-orange-500 text-lg border rounded-md p-4 mb-2 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,165,0,0.3)]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Contact Info Section */}
          <section className="bg-card rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground text-base">
              Have questions, suggestions, or feedback? We’d love to hear from you. Reach out using the info below.
            </p>
            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-primary" /> 
                <span><strong>Email:</strong> <a href="mailto:keepknowing583@gmail.com" className="text-blue-500 underline">ToolsHub Support Team</a></span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary" /> 
                <span><strong>Address:</strong> From India</span>
              </p>
              <p className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-9 w-6 text-primary dark:text-primary  "
                    >
                  <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                    </svg>
                    <span>
                      <strong>Discord:</strong>{' '}
                      <a
                        href="https://discord.gg/qCgbZtyE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Join Our Community
                      </a>
                    </span>
                  </p>

                           

            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                For business partnerships, team plans, or collaborations, email us directly at{' '}
                <a href="mailto:keepknowing583@gmail.com" className="text-blue-500 underline">ToolsHub Support Team</a>.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUsPage;

// ------------------- FAQ Content ---------------------

const faqList = [
  {
    question: "Can I collaborate with you?",
    answer: "Absolutely! We’re open to collaborations, tool integrations, and joint initiatives. Contact us with your proposal."
  },
  {
    question: "Where can I give feedback or suggestions?",
    answer: "You can email us directly or use the contact form for any ideas or improvements you'd like to see."
  },
  {
    question: "I'm facing issues with a tool. What should I do?",
    answer: "Please describe the issue and share the tool name and device/browser details. We’ll fix it ASAP."
  },
  {
    question: "Can I request a new tool?",
    answer: "Yes, we love suggestions! Let us know what kind of tool you’d like us to build."
  },
  {
    question: "How soon can I expect a reply?",
    answer: "We usually respond within 24–48 hours during weekdays."
  },
  {
    question: "Do you offer support for premium users?",
    answer: "Yes, Pro users get priority support. Just mention your Pro status when contacting us."
  },
];
