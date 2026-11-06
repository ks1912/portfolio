import ContactForm from '../components/ContactForm';
import { profile } from '../lib/data';

export default function Contact() {
  return (
    <section className="sec narrow">
      <h2><span className="num">✉</span> Contact</h2>
      <p className="lede">Questions, roles, or collaboration: I read every message.</p>
      <p className="mono">{profile.email} · {profile.location}<br /><a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a> · <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a></p>
      <ContactForm />
    </section>
  );
}
