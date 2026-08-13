import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Review the BuildCode Pro Privacy Policy to understand how we collect, use, secure, and protect your information.",
};

const sections = [
  {
    heading: "1. Information We Collect",
    body: [
      "We collect information you provide directly, such as account details, company information, project metadata, and uploaded drawings or files. We also collect certain operational data, including usage patterns, account activity, support requests, and technical metadata needed to maintain and improve the platform.",
      "This may include email address, name, role, jurisdiction, project information, billing details, and diagnostic information such as device or browser type, log data, and error reports when relevant to performance and security.",
    ],
  },
  {
    heading: "2. How We Use Information",
    body: [
      "We use your information to create and manage accounts, deliver AI-assisted analysis for uploaded drawings, provide project workflows, issue invoices, support customer service, and improve platform reliability and user experience.",
      "We may also use account and usage data to troubleshoot issues, monitor security, enforce our policies, and communicate important product or service updates. We do not sell personal information to third parties.",
    ],
  },
  {
    heading: "3. Data Sharing and Third Parties",
    body: [
      "We may share information with trusted service providers that assist us with hosting, analytics, support, billing, or security operations. Those providers are limited to the extent necessary to provide those services and are expected to handle your data in a secure and compliant manner.",
      "We may also disclose information if required by law, court order, subpoena, or to protect the rights, safety, or property of BuildCode Pro, our users, or the public.",
    ],
  },
  {
    heading: "4. Security",
    body: [
      "We implement reasonable administrative, technical, and organizational safeguards designed to protect your information from unauthorized access, misuse, or loss. However, no system is completely secure, and we cannot guarantee absolute protection against every risk.",
      "You are responsible for safeguarding your own credentials and for the information you share with others through your account. If you become aware of any unauthorized access, please contact us immediately so we can investigate and respond quickly.",
    ],
  },
  {
    heading: "5. Cookies and Tracking",
    body: [
      "We may use cookies or similar technologies to remember login state, understand product usage, improve performance, and support essential platform functions. Some cookies may be required for site security and account access, while others support analytics and product enhancements.",
      "You can manage cookie preferences through your browser settings, though some parts of the service may not function properly if required cookies are disabled.",
    ],
  },
  {
    heading: "6. Your Rights",
    body: [
      "Depending on your jurisdiction, you may have rights to access, correct, export, or delete personal information, as well as to object to or restrict certain forms of processing. If you wish to exercise those rights or have questions about your data, contact us at support@buildcodepro.com.",
      "We may request additional information to verify your identity before fulfilling a request, especially when the request concerns account or billing information.",
    ],
  },
  {
    heading: "7. Updates to This Policy",
    body: [
      "We may update this Privacy Policy as our platform and data practices evolve. When changes are material, we will notify account owners through the platform or by email where appropriate. Your continued use of the service after updates are posted indicates your acceptance of the revised policy.",
    ],
  },
  {
    heading: "8. Contact",
    body: [
      "If you have questions, concerns, or requests related to privacy or data handling, please contact support@buildcodepro.com. We will review and respond to your inquiry as quickly as practical.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="August 3, 2026"
      intro="BuildCode Pro is committed to protecting the information you share with us. This Privacy Policy explains what we collect, how we use it, when we share it, and what rights you may have regarding your data."
      sections={sections}
    />
  );
}
