import { useEffect, useState } from 'react';

const LINES = [
  ['pass', 'api/contract · schema and contract validation', '212ms'],
  ['pass', 'e2e/klara · patient messaging happy path', '3.4s'],
  ['pass', 'e2e/ema · charting and prescriptions flow', '5.1s'],
  ['pass', 'db/integrity · cross-service data sync', '861ms'],
  ['pass', 'a11y/wcag · keyboard navigation and contrast', '1.9s'],
  ['pass', 'load/k6 · latency under budget at peak load', '60s'],
  ['pass', 'pipeline · deploy gate (ArgoCD, Helm) green', '48s'],
];

export default function TestRun() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return setN(LINES.length + 1);
    const t = setInterval(() => setN((v) => (v > LINES.length + 2 ? 0 : v + 1)), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="term" role="img" aria-label="Animated terminal showing a passing test suite">
      <div className="term-bar">
        <i /><i /><i />
        <span>kunal@suite ~ npx playwright test</span>
      </div>
      <div className="term-body">
        {LINES.slice(0, n).map(([s, t, d]) => (
          <div key={t} className="tline">
            <b className={s}>✓</b> <span>{t}</span> <em>{d}</em>
          </div>
        ))}
        {n > LINES.length && (
          <div className="tsum">
            <b className="pass">{LINES.length} passed</b> · 0 failed · 0 flaky
          </div>
        )}
        <span className="cursor" />
      </div>
    </div>
  );
}
