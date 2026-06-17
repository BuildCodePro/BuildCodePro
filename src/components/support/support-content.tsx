"use client";

import { useMemo, useState } from "react";

import {
  SUPPORT_FAQS,
  SUPPORT_HELP_ARTICLES,
} from "@/lib/constants/support";

import { ContactSupportBanner } from "./contact-support-banner";
import { FaqSection } from "./faq-section";
import { HelpArticlesSection } from "./help-articles-section";
import { SupportHero } from "./support-hero";
import { SupportTicketForm } from "./support-ticket-form";

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query);
}

export function SupportContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const { filteredArticles, filteredFaqs } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return {
        filteredArticles: SUPPORT_HELP_ARTICLES,
        filteredFaqs: SUPPORT_FAQS,
      };
    }

    const filteredArticles = SUPPORT_HELP_ARTICLES.filter(
      (article) =>
        matchesQuery(article.title, query) ||
        matchesQuery(article.excerpt, query) ||
        matchesQuery(article.categoryLabel, query) ||
        article.body.some((paragraph) => matchesQuery(paragraph, query)),
    );

    const filteredFaqs = SUPPORT_FAQS.filter(
      (faq) =>
        matchesQuery(faq.question, query) ||
        matchesQuery(faq.answer, query),
    );

    return { filteredArticles, filteredFaqs };
  }, [searchQuery]);

  const hasResults = filteredArticles.length > 0 || filteredFaqs.length > 0;

  return (
    <div className="flex w-full flex-col gap-6">
      <SupportHero
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {hasResults ? (
        <>
          <HelpArticlesSection articles={filteredArticles} />
          <FaqSection faqs={filteredFaqs} />
        </>
      ) : (
        <p className="rounded-[16px] border border-border bg-white px-6 py-10 text-center font-body text-sm text-stat-label">
          No help articles or FAQs match your search. Try a different keyword.
        </p>
      )}

      <SupportTicketForm />
      <ContactSupportBanner />
    </div>
  );
}
