import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { cpp } from '@codemirror/lang-cpp';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

export const LANGS = {
  javascript: { label: 'JavaScript', ext: () => javascript(), starter: 'console.log("hello, team");\n', runnable: true },
  typescript: { label: 'TypeScript', ext: () => javascript({ typescript: true }), starter: 'const greet = (n: string): string => `hello, ${n}`;\n' },
  python: { label: 'Python', ext: () => python(), starter: 'print("hello, team")\n' },
  java: { label: 'Java', ext: () => java(), starter: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("hello, team");\n  }\n}\n' },
  cpp: { label: 'C / C++', ext: () => cpp(), starter: '#include <iostream>\nint main() {\n  std::cout << "hello, team\\n";\n}\n' },
  sql: { label: 'SQL', ext: () => sql(), starter: 'SELECT id, email FROM users WHERE active = true;\n' },
  html: { label: 'HTML', ext: () => html(), starter: '<!doctype html>\n<h1>hello, team</h1>\n' },
  css: { label: 'CSS', ext: () => css(), starter: 'body { font-family: system-ui; }\n' },
  json: { label: 'JSON', ext: () => json(), starter: '{\n  "hello": "team"\n}\n' },
  markdown: { label: 'Markdown', ext: () => markdown(), starter: '# Notes\n' },
};

export const THEMES = {
  'one-dark': { label: 'One Dark', theme: oneDark },
  'github-dark': { label: 'GitHub Dark', theme: githubDark },
  'github-light': { label: 'GitHub Light', theme: githubLight },
};
