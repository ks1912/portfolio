import { supabase } from './supabase';

export const profile = {
  name: 'Kunal Singh',
  role: 'SDET · QA Team Lead',
  location: 'Hyderabad, India',
  email: 'kunalsingh886312@gmail.com',
  site: 'kunalsingh.tech',
  github: 'ks1912',
  about:
    'I build the safety net that lets product teams ship fast. Over 5 years I have designed automation frameworks, API and load testing strategies, and CI/CD pipelines for healthcare, e-commerce and BFSI products, and I lead the people who run them.',
};

export const stats = [
  { n: '5+', label: 'years in quality engineering' },
  { n: '3', label: 'industries: healthcare, e-commerce, BFSI' },
  { n: '3', label: 'engineers led and mentored' },
  { n: '2', label: 'products on-call: Klara & EMA' },
];

export const experience = [
  {
    company: 'Modmed',
    role: 'Senior Software Quality Engineer 1 · QA Team Lead',
    period: 'Feb 2024 – Present',
    meta: 'Klara & EMA',
    points: [
      'Lead a team of 3: hiring interviews, onboarding, mentoring, sprint execution and backlog grooming under SAFe.',
      'Built end-to-end automation for Klara and EMA with Playwright, Python, JavaScript and Ruby on Rails.',
      'Designed API strategies covering validation, schema checks, contract testing and workflow automation with Postman, Rest Assured and Playwright API.',
      'Built internal test APIs for mock environments and test data generation, improving speed and stability.',
      'Own CI/CD on GitHub Actions, AWS, ArgoCD and Docker; manage Helm charts and clusters with k9s.',
      'On-call for production: Datadog monitoring, log triage and real-time troubleshooting.',
      'Run K6 and Locust load tests, SQL data-integrity testing and WCAG accessibility testing.',
    ],
  },
  {
    company: 'Feuji Software Solutions',
    role: 'Software Engineer',
    period: 'Sep 2021 – Jan 2024',
    meta: 'Evalueserve · MyParadigm',
    points: [
      'Playwright (TypeScript and Python) end-to-end and API automation for Evalueserve products such as InsightsFirst and AnalyticsApp.',
      'Built a Cypress framework for MyParadigm covering UI regression and functional suites.',
      'Integrated suites into Jenkins and Docker pipelines with Report Portal for centralised reporting.',
      'Handled dynamic UI scenarios, with elements hidden, changed or replaced by catalogue data.',
      'Interviewed candidates and trained new joiners on frameworks, tools and best practices.',
    ],
  },
  {
    company: 'IDRBT (RBI – Govt of India)',
    role: 'Software Engineer',
    period: 'Jan 2021 – Sep 2021',
    meta: 'Payment Integration · Sentiment Analysis',
    points: [
      'Built and validated Selenium WebDriver frameworks for payment gateway and transaction flows.',
      'API testing with Rest Assured and SOAP UI to verify data-processing accuracy.',
    ],
  },
];

export const skills = [
  { group: 'Languages', items: ['JavaScript / TypeScript', 'Python', 'Ruby on Rails', 'YAML', 'SQL'] },
  { group: 'UI automation', items: ['Playwright', 'Cypress', 'Selenium', 'Page Object Model'] },
  { group: 'API & load', items: ['Rest Assured', 'Postman', 'SOAP UI', 'K6', 'Locust'] },
  { group: 'CI/CD & infra', items: ['GitHub Actions', 'Jenkins', 'Docker', 'ArgoCD', 'Helm', 'k9s', 'Terraform', 'AWS'] },
  { group: 'Data & services', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'RabbitMQ', 'Sidekiq', 'Twilio'] },
  { group: 'Practice', items: ['SAFe Agile', 'JIRA', 'WCAG', 'Datadog', 'Report Portal', 'ReactJS'] },
];

export const fallbackProjects = [
  { id: 'p1', title: 'Klara & EMA E2E Automation', description: 'Playwright suites in Python and JavaScript for two healthcare products, with API, contract and SQL data-integrity checks wired into GitHub Actions, ArgoCD and Docker pipelines.', tags: ['Playwright', 'Python', 'GitHub Actions', 'ArgoCD'], featured: true },
  { id: 'p2', title: 'Internal Test API Platform', description: 'Test APIs that generate data, mock environments and stabilise automation runs, which makes suites faster and far less flaky.', tags: ['Ruby on Rails', 'Sidekiq', 'RabbitMQ', 'PostgreSQL'], featured: true },
  { id: 'p3', title: 'Load & Performance Harness', description: 'K6 and Locust scenarios for realistic traffic, monitored through Datadog during runs to catch regressions before production.', tags: ['K6', 'Locust', 'Datadog'], featured: true },
  { id: 'p4', title: 'Cypress Regression Framework', description: 'UI regression and functional framework for MyParadigm, with Docker and Jenkins execution and Report Portal reporting.', tags: ['Cypress', 'JavaScript', 'Jenkins', 'Docker'], featured: false },
];

export async function loadProjects() {
  if (!supabase) return fallbackProjects;
  const { data, error } = await supabase.from('projects').select('*').order('sort');
  return error || !data?.length ? fallbackProjects : data;
}

export async function loadPosts() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('posts')
    .select('id,slug,title,excerpt,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function trackView(path) {
  if (!supabase) return;
  try {
    await supabase.from('page_views').insert({ path, referrer: document.referrer.slice(0, 300) || null });
  } catch {
    /* analytics must never break the site */
  }
}
