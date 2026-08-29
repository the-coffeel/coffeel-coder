import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Coffeel Coder",
  description: "Privacy policy for the Coffeel Coder community and digital agency.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
        <div className="space-y-4 mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-500">
            // legal
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#f5f0e8]">
            Privacy Policy
          </h1>
          <p className="text-[#a89880]">Last Updated: August 29, 2026</p>
        </div>

        <article className="prose prose-invert max-w-none text-[#c4b49a] space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              1. Information We Collect
            </h2>
            <p>
              At Coffeel Coder, we collect information you provide directly to us when you join our community, register for an event, or request a quote for our agency services. This may include your name, email address, GitHub profile, and details about your project or business.
            </p>
            <p>
              We also automatically collect certain information about your device and how you interact with our website to improve your experience and our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
              <li>To provide, maintain, and improve our community platform and agency services.</li>
              <li>To communicate with you, including sending newsletters, updates, and event information.</li>
              <li>To process transactions and send related information (e.g., invoices for agency clients).</li>
              <li>To monitor and analyze trends, usage, and activities in connection with our website.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              3. Information Sharing
            </h2>
            <p>
              We do not share your personal information with third parties except as described in this privacy policy, such as with vendors and service providers who need access to such information to carry out work on our behalf (e.g., payment processing, email delivery).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              4. Data Security
            </h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#f5f0e8] border-b border-[#6f4e37]/40 pb-2">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <Link href="mailto:coffeelcoder@gmail.com" className="text-amber-500 hover:text-amber-400 underline underline-offset-4">
                coffeelcoder@gmail.com
              </Link>
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
