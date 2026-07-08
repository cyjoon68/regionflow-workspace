import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const project = 'regionflow';
const normalizeRemote = (value) => value
  .replace(/^https:\/\/[^@]+@github\.com\//, 'https://github.com/')
  .replace(/\.git$/, '');
const expectRemote = (remote, expected) => {
  const actual = normalizeRemote(execFileSync('git', ['remote', 'get-url', remote], { encoding: 'utf8' }).trim());
  if (actual !== expected) throw new Error(`wrong ${remote} remote`);
};
const expectChildOrigin = (name, expected) => {
  const actual = normalizeRemote(execFileSync('git', ['-C', name, 'remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim());
  if (actual !== expected) throw new Error(`wrong child origin ${name}`);
};
const required = [
  '.gitmodules',
  '.github/workflows/ci.yml',
  '.env.example',
  'docker-compose.yml',
  'deploy/argocd/regionflow.yaml',
  'deploy/k8s/backend.yaml',
  'deploy/k8s/frontend.yaml',
  'observability/grafana/regionflow-dashboard.json',
  'regionflow-fe/package.json',
  'regionflow-fe/scripts/self-check.mjs',
  'regionflow-be/openapi.yaml',
  'regionflow-be/requests.http',
  'docs/resume-evidence.md'
];

for (const file of required) {
  if (!existsSync(file)) throw new Error(`missing ${file}`);
}

const modules = readFileSync('.gitmodules', 'utf8');
for (const name of ['regionflow-fe', 'regionflow-be']) {
  if (!modules.includes(`[submodule "${name}"]`)) throw new Error(`missing submodule ${name}`);
  if (!modules.includes(`path = ${name}`)) throw new Error(`wrong submodule path ${name}`);
  if (!modules.includes(`url = https://github.com/regionflow-data/${name}.git`)) throw new Error(`wrong submodule url ${name}`);
  if (!modules.includes('branch = develop')) throw new Error(`wrong submodule branch ${name}`);
}
expectRemote('origin', 'https://github.com/regionflow-data/regionflow-workspace');
const remotes = execFileSync('git', ['remote'], { encoding: 'utf8' });
if (remotes.split('\n').includes('personal')) expectRemote('personal', 'https://github.com/cyjoon68/regionflow-workspace');
for (const name of ['regionflow-fe', 'regionflow-be']) {
  expectChildOrigin(name, `https://github.com/regionflow-data/${name}`);
}

const openapi = readFileSync(`${project}-be/openapi.yaml`, 'utf8');
if (!openapi.includes('/api/dashboard')) throw new Error('openapi endpoint missing');
const evidence = readFileSync('docs/resume-evidence.md', 'utf8');
if (!evidence.includes('Interview proof:')) throw new Error('resume evidence missing interview proof');
if (!evidence.includes('Airflow DAG')) throw new Error('resume evidence missing pipeline proof');

for (const file of ['.github/workflows/ci.yml', `${project}-fe/.github/workflows/ci.yml`, `${project}-be/.github/workflows/ci.yml`]) {
  const ci = readFileSync(file, 'utf8');
  if (!ci.includes('Validate git rules')) throw new Error(`missing git rules gate: ${file}`);
  if (!ci.includes('github.event.pull_request.title')) throw new Error(`missing PR title gate: ${file}`);
}

execFileSync('node', ['scripts/self-check.mjs'], { cwd: `${project}-fe`, stdio: 'inherit' });
execFileSync('python3', ['scripts/self_check.py'], {
  cwd: `${project}-be`,
  env: { ...process.env, PYTHONPATH: 'src' },
  stdio: 'inherit'
});

console.log(`${project}-workspace_self_check_ok`);
