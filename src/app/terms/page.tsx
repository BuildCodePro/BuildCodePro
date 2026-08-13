import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the BuildCode Pro Terms of Service for account use, subscriptions, AI-generated estimates, and platform rules.",
};

const sections = [
  {
    heading: "1. Acceptance of Terms",
    body: [
      "By creating an account or using BuildCode Pro, you confirm that you are at least 18 years old and legally able to enter into this agreement. These Terms of Service govern your access to and use of the platform, including AI-assisted estimation, project analysis, exports, and related services.",
      "We may update these terms from time to time. Continued use of the platform after a modification constitutes acceptance of the updated terms. If you do not agree to any changes, you should discontinue use of the service and cancel your account if applicable.",
    ],
  },
  {
    heading: "2. Account Responsibilities",
    body: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate information during signup, keep contact details current, and notify us promptly if you suspect unauthorized access or misuse.",
      "You may not share your account with third parties or use the platform for unlawful, deceptive, or abusive conduct. Any non-compliance may result in restricted access, suspension, or termination of your account.",
    ],
  },
  {
    heading: "3. AI-Generated Results and Professional Review",
    body: [
      "BuildCode Pro uses AI to analyze uploaded drawings and project information to generate design recommendations, takeoff items, compliance summaries, and export-ready documents. These outputs are intended to accelerate preliminary planning and estimating workflows.",
      "AI-generated outputs are not a substitute for licensed professional review, engineering judgment, code interpretation, or jurisdiction-specific approval. Final designs, construction decisions, and permit submissions must be reviewed and approved by qualified professionals when required by law or your project requirements.",
    ],
  },
  {
    heading: "4. Subscription, Billing, and Usage",
    body: [
      "Certain features and monthly usage limits are tied to subscription plans. Fees are billed according to the plan selected and the billing cycle in effect. We may change pricing or plan details with reasonable notice where required by contract or applicable law.",
      "If you exceed plan limits, access may be restricted until the next billing cycle or until an upgrade is processed. We may cancel or suspend access for non-payment or repeated misuse of the service.",
    ],
  },
  {
    heading: "5. Intellectual Property and User Content",
    body: [
      "You retain ownership of the content you upload to the platform, including plans, project information, and related files. By submitting content, you grant us a limited license to process, store, and use that content to provide the services described in this agreement.",
      "We retain ownership of the platform, software, branding, templates, and all proprietary elements associated with the service. You may not reverse engineer, redistribute, or resell the platform or its outputs outside of your authorized use of the service.",
    ],
  },
  {
    heading: "6. Limitation of Liability and Termination",
    body: [
      "BuildCode Pro is provided on an “as is” basis. We do not guarantee uninterrupted availability or that every AI recommendation will be accurate for every project, jurisdiction, or field condition. Our liability for damages arising from the service is limited to the fees paid or payable for the relevant service period, to the maximum extent permitted by law.",
      "We may suspend or terminate access to the service if you violate these Terms, fail to pay fees, or pose a security or operational risk. Upon termination, your right to use the platform ceases, although portions of these Terms may remain enforceable as necessary to protect our rights and obligations.",
    ],
  },
  {
    heading: "7. Contact",
    body: [
      "If you have questions about these Terms of Service or any use of the platform, please contact us at support@buildcodepro.com. We are happy to review concerns and clarify the conditions of service for your account or organization.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="August 3, 2026"
      intro="These Terms of Service describe how you may use BuildCode Pro and the responsibilities that apply to both you and our team when you access the platform."
      sections={sections}
    />
  );
}
