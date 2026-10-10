"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useId, useRef, useState, type FormEvent } from "react";

import { site } from "@/config/site";
import { CONTACT_TOPICS, parseContactPrefill, type ContactPrefill, type ContactTopic } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { isEmailOrPhone, submitEnquiry } from "@/lib/enquiry-client";
import { addDays, GUEST_COUNTS, guestsLabel, isIsoDate, localTodayIso, nightsBetween } from "@/lib/stay/dates";
import { unitsFor } from "@/lib/stay/units";
import { useHydrated } from "@/lib/stay/useStayDates";
import ui from "@/styles/ui.module.css";

import styles from "./ContactForm.module.css";
import { isStayTopic, requestEmailHref, staySummary, type StayRequest } from "./request";

const TOPICS = Object.entries(CONTACT_TOPICS) as [ContactTopic, string][];

/** Rooms and bungalows to choose from for a stay topic (camping has its own topic). */
function unitOptions(topic: ContactTopic): string[] {
  if (topic !== "katun" && topic !== "hotel") return [];
  return unitsFor(topic)
    .filter((unit) => unit.kind !== "camping")
    .map((unit) => unit.name);
}

type FieldError = { text: string; field?: "contact" | "dates" };

/** After sending: "sent" went to the family; "email" means the preview could not send, so the visitor emails it. */
type Done = { kind: "sent"; text: string } | { kind: "email"; href: string };

type ContactFormProps = {
  /** Request passed in the URL, e.g. from "Request these dates" on a bungalow. */
  prefill?: ContactPrefill;
};

/** The request form. Rendered empty as the Suspense fallback, then pre-filled from the URL. */
export function ContactForm({ prefill = {} }: ContactFormProps) {
  const hydrated = useHydrated();
  const today = hydrated ? localTodayIso() : "";

  const [topic, setTopic] = useState<ContactTopic>(prefill.topic ?? "katun");
  const [unit, setUnit] = useState(prefill.unit ?? "");
  const [checkin, setCheckin] = useState(prefill.checkin && isIsoDate(prefill.checkin) ? prefill.checkin : "");
  const [checkout, setCheckout] = useState(prefill.checkout && isIsoDate(prefill.checkout) ? prefill.checkout : "");
  const [guests, setGuests] = useState(prefill.guests ?? "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<FieldError | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const contactRef = useRef<HTMLInputElement>(null);
  const checkinRef = useRef<HTMLInputElement>(null);
  /** Set by "Write another message" so the fresh form's message box takes focus. */
  const refocusMessage = useRef(false);
  const contactErrorId = useId();
  const datesErrorId = useId();
  const datesHintId = useId();

  const stayTopic = isStayTopic(topic);
  const units = unitOptions(topic);
  // A room named in the link stays listed even if the names change later.
  const unitList = unit && !units.includes(unit) && stayTopic && topic !== "camping" ? [unit, ...units] : units;
  const request: StayRequest = {
    topic,
    unit: topic === "camping" ? undefined : unit || undefined,
    checkin: stayTopic ? checkin : undefined,
    checkout: stayTopic ? checkout : undefined,
    guests: stayTopic ? guests : undefined,
    name,
    contact,
    message,
  };

  // Stable callback refs: they run once when their element mounts.
  const focusOnMount = useCallback((el: HTMLElement | null) => el?.focus(), []);
  const messageRef = useCallback((el: HTMLTextAreaElement | null) => {
    if (el && refocusMessage.current) {
      refocusMessage.current = false;
      el.focus();
    }
  }, []);

  function changeTopic(next: ContactTopic) {
    setTopic(next);
    if (!unitOptions(next).includes(unit)) setUnit("");
  }

  /** Moving check-in onto or past check-out carries check-out along, keeping the stay's length. */
  function changeCheckin(next: string) {
    setCheckin(next);
    if (isIsoDate(next) && isIsoDate(checkout) && checkout <= next) {
      const nights = isIsoDate(checkin) ? Math.max(1, nightsBetween(checkin, checkout)) : 1;
      setCheckout(addDays(next, nights));
    }
  }

  function datesProblem(): string | null {
    if (!stayTopic) return null;
    if (checkin && !isIsoDate(checkin)) return "Please check the check-in date.";
    if (checkout && !isIsoDate(checkout)) return "Please check the check-out date.";
    if (checkin && today && checkin < today) return "Choose a check-in date from today onwards.";
    if (checkin && checkout && nightsBetween(checkin, checkout) <= 0) {
      return "Choose a check-out date after your check-in.";
    }
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reply = contact.trim();
    if (!isEmailOrPhone(reply)) {
      setError({
        text: reply
          ? "Please enter a valid email address or phone number."
          : "Please leave an email address or phone number so the family can reply.",
        field: "contact",
      });
      contactRef.current?.focus();
      return;
    }
    const dates = datesProblem();
    if (dates) {
      setError({ text: dates, field: "dates" });
      checkinRef.current?.focus();
      return;
    }

    const honeypot = new FormData(event.currentTarget).get("company");
    const nights = request.checkin && request.checkout ? nightsBetween(request.checkin, request.checkout) : 0;
    setSending(true);
    setError(null);
    const res = await submitEnquiry("contact", {
      topic: CONTACT_TOPICS[topic],
      unit: request.unit,
      checkin: request.checkin || undefined,
      checkout: request.checkout || undefined,
      nights: nights > 0 ? nights : undefined,
      guests: request.guests || undefined,
      name: name.trim(),
      contact: reply,
      email: reply.includes("@") ? reply : undefined,
      message: message.trim(),
      company: typeof honeypot === "string" ? honeypot : "",
    });
    setSending(false);

    if (!res.ok) {
      setError({ text: res.error });
      return;
    }
    if (res.preview) {
      setDone({ kind: "email", href: requestEmailHref(request) });
      return;
    }
    const first = name.trim().split(/\s+/)[0];
    const thanks = first ? `Thank you, ${first}` : "Thank you";
    setDone({
      kind: "sent",
      text: stayTopic
        ? `${thanks} — your request is with the family. They'll reply with availability and the price.`
        : `${thanks} — your message is with the family. They'll get back to you by email or phone.`,
    });
  }

  function writeAnother() {
    refocusMessage.current = true;
    setMessage("");
    setDone(null);
  }

  const contactInvalid = error?.field === "contact";
  const datesInvalid = error?.field === "dates";
  const summary = staySummary(request);

  return (
    <>
      {!done && (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <fieldset className={styles.topics}>
            <legend className={cx(ui.label, styles.legend)}>What&rsquo;s it about?</legend>
            <div className={styles.topicChips}>
              {TOPICS.map(([value, label]) => (
                <label key={value} className={styles.topic}>
                  <input
                    type="radio"
                    name="topic"
                    value={value}
                    className={styles.topicInput}
                    checked={topic === value}
                    onChange={() => changeTopic(value)}
                  />
                  <span className={styles.topicPill}>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {stayTopic && (
            <fieldset className={styles.stay}>
              <legend className={cx(ui.label, styles.stayLegend)}>Your stay</legend>
              {unitList.length > 0 && (
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Room or bungalow</span>
                  <select
                    className={cx(styles.input, styles.select)}
                    name="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="">No preference — suggest one</option>
                    {unitList.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className={styles.stayRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Check-in</span>
                  <input
                    ref={checkinRef}
                    className={styles.input}
                    type="date"
                    name="checkin"
                    min={today || undefined}
                    value={checkin}
                    aria-invalid={datesInvalid || undefined}
                    aria-describedby={datesInvalid ? `${datesErrorId} ${datesHintId}` : datesHintId}
                    onChange={(e) => changeCheckin(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Check-out</span>
                  <input
                    className={styles.input}
                    type="date"
                    name="checkout"
                    min={(isIsoDate(checkin) ? addDays(checkin, 1) : today) || undefined}
                    value={checkout}
                    aria-invalid={datesInvalid || undefined}
                    aria-describedby={datesInvalid ? `${datesErrorId} ${datesHintId}` : datesHintId}
                    onChange={(e) => setCheckout(e.target.value)}
                  />
                </label>
                <label className={cx(styles.field, styles.guestsField)}>
                  <span className={styles.fieldLabel}>Guests</span>
                  <select
                    className={cx(styles.input, styles.select)}
                    name="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    <option value="">Choose</option>
                    {GUEST_COUNTS.map((count) => (
                      <option key={count} value={String(count)}>
                        {guestsLabel(count)}
                      </option>
                    ))}
                    <option value="7">7 or more</option>
                  </select>
                </label>
              </div>
              {datesInvalid && (
                <p id={datesErrorId} className={styles.fieldError} role="alert">
                  {error.text}
                </p>
              )}
              <p id={datesHintId} className={styles.hint}>
                No exact dates yet? Leave them empty and say roughly when in your message.
              </p>
            </fieldset>
          )}

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={ui.label}>Your name</span>
              <input
                className={styles.input}
                type="text"
                name="name"
                autoComplete="name"
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className={styles.fieldWrap}>
              <label className={styles.field}>
                <span className={ui.label}>Email or phone</span>
                <input
                  ref={contactRef}
                  className={styles.input}
                  type="text"
                  inputMode="email"
                  name="contact"
                  autoComplete="email"
                  placeholder="you@example.com or +44 …"
                  required
                  aria-invalid={contactInvalid || undefined}
                  aria-describedby={contactInvalid ? contactErrorId : undefined}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </label>
              {contactInvalid && (
                <p id={contactErrorId} className={styles.fieldError} role="alert">
                  {error.text}
                </p>
              )}
            </div>
          </div>

          <label className={styles.field}>
            <span className={ui.label}>Message</span>
            <textarea
              ref={messageRef}
              className={styles.textarea}
              name="message"
              rows={5}
              placeholder={
                stayTopic
                  ? "Who's coming, children's ages, when you'll arrive, anything you'd like the family to know."
                  : "How can the family help?"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          {/* Spam trap: hidden from people, filled in by bots. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="visually-hidden"
            aria-hidden="true"
          />

          <div className={styles.submitRow}>
            <button type="submit" className={cx(ui.btnGold, styles.submit)} disabled={sending}>
              {sending ? "Sending…" : stayTopic ? "Send request" : "Send message"}
            </button>
            <p className={styles.alt}>
              Prefer to talk?{" "}
              <a href={site.phone.href} className={styles.altLink}>
                Call {site.phone.display}
              </a>
            </p>
          </div>

          {error && !contactInvalid && !datesInvalid && (
            <p className={styles.formError} role="alert">
              {error.text}
            </p>
          )}
        </form>
      )}

      <div role="status">
        {done?.kind === "sent" && (
          <div className={styles.sent}>
            <span className={styles.sentMark} aria-hidden="true" />
            <h3 ref={focusOnMount} tabIndex={-1} className={styles.sentTitle}>
              {stayTopic ? "Request sent" : "Message sent"}
            </h3>
            <p className={styles.sentText}>{done.text}</p>
            <button type="button" className={cx(ui.btnOutline, styles.again)} onClick={writeAnother}>
              Write another message
            </button>
          </div>
        )}
        {done?.kind === "email" && (
          <div className={styles.sent}>
            <h3 ref={focusOnMount} tabIndex={-1} className={styles.sentTitle}>
              One last step
            </h3>
            <p className={styles.sentText}>
              This preview of the new website can&rsquo;t send forms yet, so your request is written out as an email,
              ready to send to {site.email.display} from your own mail app.
            </p>
            {summary.length > 0 && (
              <ul className={styles.stayChips} aria-label="Your stay">
                <li>{CONTACT_TOPICS[topic]}</li>
                {summary.map((part) => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            )}
            <div className={styles.sentActions}>
              <a href={done.href} className={ui.btnGold}>
                Open it in my email
              </a>
              <a href={site.phone.href} className={ui.btnOutline}>
                Or call {site.phone.display}
              </a>
            </div>
            <button type="button" className={styles.back} onClick={() => setDone(null)}>
              Back to the form
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/** Reads the request from the query string (see contactHref) and starts the form from it. */
export function ContactFormFromUrl() {
  const params = useSearchParams();
  // A new query (e.g. following another request link) starts a fresh form.
  return <ContactForm key={params.toString()} prefill={parseContactPrefill(params)} />;
}
