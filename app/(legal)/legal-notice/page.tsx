import type { Metadata } from 'next';
import legal from '@/legal.config.json';

export const metadata: Metadata = {
  title: 'Legal Notice',
  description: 'Ownership and terms of use of the Steel Naked website.',
};

const P = ({ children }: { children: string }) => <span className="pending">{children}</span>;

export default function LegalNotice() {
  return (
    <article>
      <h1>Legal Notice</h1>
      <p className="updated">Last updated · 21 Jul 2026</p>

      <h2>1. Site owner</h2>
      <p>
        In compliance with Spanish Law 34/2002 (LSSI-CE, art. 10), the owner of this website is:
      </p>
      <ul>
        <li>Owner: <P>{legal.titular}</P></li>
        <li>NIF/CIF: <P>{legal.nif}</P></li>
        <li>Registered address: <P>{legal.direccion}</P></li>
        <li>Email: <a href={`mailto:${legal.email}`}>{legal.email}</a></li>
        <li>Website: <a href={legal.web}>{legal.web}</a></li>
      </ul>

      <h2>2. Purpose</h2>
      <p>
        This site presents Steel Naked — a seating object folded from a single sheet of stainless
        steel, designed and crafted in Valencia, Spain — and lets visitors join a launch waitlist.
      </p>

      <h2>3. Intellectual property</h2>
      <p>
        The design, images, texts, wordmark and all content on this site are the property of the
        owner or used with permission, and are protected by intellectual-property law. They may not
        be reproduced or reused without written authorisation.
      </p>

      <h2>4. Liability</h2>
      <p>
        The owner is not liable for any harm arising from the use of this site, nor for temporary
        interruptions of the service. External links, if any, are the responsibility of their
        respective sites.
      </p>

      <h2>5. Governing law</h2>
      <p>
        This notice is governed by Spanish law. Any dispute will be subject to the courts of the
        registered address of the owner, unless mandatory law provides otherwise.
      </p>

      <p style={{ marginTop: '2.5em', fontSize: 13, opacity: 0.7 }}>
        Values shown in <span className="pending">this style</span> are pending and must be completed
        before public launch.
      </p>
    </article>
  );
}
