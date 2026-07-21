import type { Metadata } from 'next';
import legal from '@/legal.config.json';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Steel Naked handles the personal data you share through this site.',
};

const P = ({ children }: { children: string }) => <span className="pending">{children}</span>;

export default function PrivacyPolicy() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated · 21 Jul 2026</p>

      <h2>1. Who is responsible for your data</h2>
      <p>
        The data controller for this website is <P>{legal.titular}</P> (NIF/CIF <P>{legal.nif}</P>),
        registered at <P>{legal.direccion}</P>. You can reach us at{' '}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>

      <h2>2. What data we collect</h2>
      <p>
        We only collect what you actively send us through the <strong>waitlist form</strong>: your{' '}
        <strong>email address</strong> and, optionally, a short <strong>message</strong>. We do not
        collect any other personal data, and this site uses no analytics or advertising cookies.
      </p>

      <h2>3. Why we use it, and the legal basis</h2>
      <p>
        We use your email solely to notify you about the launch of Steel Naked and the founder
        edition. The legal basis is your <strong>consent</strong> (Art. 6(1)(a) GDPR), given when you
        submit the form. You can withdraw it at any time by writing to{' '}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>

      <h2>4. Who processes it</h2>
      <p>
        Your submission is handled by our hosting provider, <strong>Vercel Inc.</strong> (United
        States), which processes it on our behalf under its data-processing terms and the EU–US Data
        Privacy Framework / Standard Contractual Clauses. We do not sell or share your data with
        third parties for their own purposes.
      </p>

      <h2>5. How long we keep it</h2>
      <p>
        We keep your email until the waitlist purpose is fulfilled or until you ask us to delete it,
        whichever comes first.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You have the right to access, rectify, erase, restrict and port your data, and to object to
        its processing. Write to <a href={`mailto:${legal.email}`}>{legal.email}</a> to exercise any
        of these. You also have the right to lodge a complaint with the Spanish Data Protection
        Agency (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">AEPD</a>).
      </p>

      <h2>7. Cookies</h2>
      <p>
        This site does not use tracking, analytics or advertising cookies, so no consent banner is
        required. Only strictly necessary technical requests take place to serve the page.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this policy as the project evolves (for example, when the waitlist backend goes
        live). The date at the top always reflects the current version.
      </p>

      <p style={{ marginTop: '2.5em', fontSize: 13, opacity: 0.7 }}>
        This is a reasonable baseline, not legal advice. Values shown in{' '}
        <span className="pending">this style</span> are pending and must be completed before public
        launch.
      </p>
    </article>
  );
}
