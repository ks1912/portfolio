import { useState } from 'react';
import Reveal from '../components/Reveal';

const sheets = [
  { title: 'Playwright', items: [
    ['Async / await', 'await page.click(selector)'],
    ['Locators', "page.locator('text=Submit')"],
    ['Role locator', "page.getByRole('button', { name: 'Save' })"],
    ['Web-first assert', "await expect(page.getByRole('status')).toHaveText('Saved')"],
    ['Trace viewer', 'await context.tracing.start({ screenshots: true })'],
    ['API request', "await request.get('/api/health')"],
  ] },
  { title: 'Cypress', items: [
    ['Intercept', "cy.intercept('GET', '/api/*').as('list')"],
    ['Wait on alias', "cy.wait('@list')"],
    ['Custom command', 'Cypress.Commands.add(name, fn)'],
    ['Fixtures', "cy.fixture('data.json')"],
  ] },
  { title: 'TypeScript', items: [
    ['Interfaces', 'interface User { name: string }'],
    ['Enums', 'enum Status { Active, Inactive }'],
    ['Generics', 'function id<T>(arg: T): T'],
    ['Utility types', 'Partial<User> | Pick<User, "name">'],
  ] },
  { title: 'JavaScript', items: [
    ['Destructuring', 'const { name } = user'],
    ['Promises', 'promise.then().catch()'],
    ['Map / filter', 'array.map((x) => x * 2)'],
    ['Parallel async', 'await Promise.all([a(), b()])'],
  ] },
  { title: 'Git & GitHub', items: [
    ['Branching', 'git checkout -b feature/new'],
    ['Push branch', 'git push origin branch'],
    ['Actions trigger', 'on: [push, pull_request]'],
    ['Stash', 'git stash push -m "wip"'],
  ] },
  { title: 'Jenkins', items: [
    ['Pipeline', 'pipeline { agent any }'],
    ['Env var (Groovy)', 'def buildNumber = env.BUILD_ID'],
    ['Stage', 'stage("Test") { steps { sh "npm test" } }'],
  ] },
  { title: 'AWS', items: [
    ['S3 copy', 'aws s3 cp file.txt s3://bucket'],
    ['EC2 list', 'aws ec2 describe-instances'],
    ['CloudWatch logs', 'aws logs get-log-events'],
  ] },
  { title: 'Load testing (K6)', items: [
    ['Run', 'k6 run script.js'],
    ['Virtual users', 'export const options = { vus: 50, duration: "1m" }'],
    ['Threshold', "thresholds: { http_req_duration: ['p(95)<500'] }"],
  ] },
];

function Snippet({ label, code }) {
  const [done, setDone] = useState(false);
  return (
    <div className="snip">
      <div className="snip-label">{label}</div>
      <button className="snip-code" title="Click to copy" onClick={() => { navigator.clipboard?.writeText(code); setDone(true); setTimeout(() => setDone(false), 1200); }}>
        <code>{code}</code><span>{done ? '✓ copied' : 'copy'}</span>
      </button>
    </div>
  );
}

export default function Cheatsheets() {
  return (
    <section className="sec">
      <h2><span className="num">{'{ }'}</span> Developer reference</h2>
      <p className="lede" style={{ marginBottom: 28 }}>Quick reference for methods and commands across my core stack. Click any snippet to copy it.</p>
      <div className="skills">
        {sheets.map((s, i) => (
          <Reveal key={s.title} delay={i * 40} className="card">
            <h4>{s.title}</h4>
            <div className="stack" style={{ marginTop: 0, gap: 10 }}>
              {s.items.map(([l, c]) => <Snippet key={l} label={l} code={c} />)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
