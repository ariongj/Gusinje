import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactEnquiry } from "@/components/contact/ContactEnquiry";
import { ContactForm, ContactFormFromUrl } from "@/components/contact/ContactForm";
import { ContactLocation } from "@/components/contact/ContactLocation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/config/site";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Contact & requests",
  description: `Ask about a stay, a table or a transfer — call ${site.phone.display}, email ${site.email.display} or send a request to the family behind Eko Katun ROSI in Vusanje and Hotel ROSI in Gusinje, Montenegro.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Check dates", href: "/#book" }} />
      <main>
        <PageHero
          kicker="Contact"
          size="compact"
          overlap
          title={
            <>
              Talk to <em>the family</em>
            </>
          }
          intro="Bookings go straight to the people who run both places — no middleman and no booking fees. Send your dates, or simply call."
          actions={
            <>
              <a href="#write" className={ui.btnGold}>
                Send a request
              </a>
              <a href={site.phone.href} className={ui.btnOutlineLight}>
                Call {site.phone.display}
              </a>
            </>
          }
        />
        <ContactEnquiry>
          {/* The pre-fill comes from the query string, so the page is prerendered
              with the empty form and the filled one takes over in the browser. */}
          <Suspense fallback={<ContactForm />}>
            <ContactFormFromUrl />
          </Suspense>
        </ContactEnquiry>
        <ContactLocation />
      </main>
      <SiteFooter />
    </>
  );
}
