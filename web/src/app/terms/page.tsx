import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Coffeel Coder",
  description: "Terms and conditions for the Coffeel Coder community and digital agency.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
        <div className="space-y-4 mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-500">
            // legal
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#f5f0e8]">
            Terms and Conditions
          </h1>
          <p className="text-[#a89880]">Last Updated: August 29, 2026</p>
        </div>

        <article className="prose prose-invert max-w-none text-[#c4b49a] space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Coffeel Coder website, community platforms (including Discord), and agency services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              2. Community Conduct
            </h2>
            <p>
              Coffeel Coder is dedicated to providing a harassment-free experience for everyone. We expect all community members to:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
              <li>Be respectful and constructive in all communications.</li>
              <li>Refrain from demeaning, discriminatory, or harassing behavior and speech.</li>
              <li>Respect the privacy and intellectual property of others.</li>
            </ul>
            <p>
              We reserve the right to remove any member from our platforms who violates these guidelines without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              3. Agency Services
            </h2>
            <p>
              For clients engaging Coffeel Coder for digital agency services (Web Development, SEO, etc.), specific terms, deliverables, and payment schedules will be outlined in a separate Statement of Work (SOW) or service agreement. These Terms and Conditions serve as the baseline agreement for all engagements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              4. Intellectual Property
            </h2>
            <p>
              The content, organization, graphics, design, compilation, and other matters related to our Site are protected under applicable copyrights, trademarks, and other proprietary rights. Open-source projects hosted by the community remain under their respective open-source licenses.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall Coffeel Coder, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              6. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:{" "}
              <a href="mailto:coffeelcoder@gmail.com" className="text-amber-500 hover:text-amber-400 underline underline-offset-4">
                coffeelcoder@gmail.com
              </a>
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
