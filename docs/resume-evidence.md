# regionflow Resume Evidence

Service summary:
- Python Airflow Redshift analytics.

Repository evidence:
- Origin workspace: https://github.com/regionflow-data/regionflow-workspace
- Frontend repo: https://github.com/regionflow-data/regionflow-fe
- Backend repo: https://github.com/regionflow-data/regionflow-be
- Personal mirror: https://github.com/cyjoon68/regionflow-workspace

Implementation evidence:
- Frontend: Expo Router, feature-layer API via `ky`, Unistyles UI.
- Backend: domain API contract in `regionflow-be/openapi.yaml`.
- Data: Airflow MySQL metadata SQL plus Redshift regional fulfillment mart.
- Infra: Dockerfile, GitHub Actions, ArgoCD, Kubernetes, Grafana dashboard stub.
- Ops: MySQL, Redis, RabbitMQ, Datadog-style logging/telemetry, Sentry env boundary.

Interview proof:
- API: `GET /api/dashboard`.
- Pipeline: Airflow DAG extracts regional signals, transforms replenishment actions, publishes snapshots.
- Data boundary: MySQL tracks pipeline runs, Redshift serves regional fulfillment analytics.
- Production angle: separate FE/BE repos, workspace submodules, GitOps manifest, CI rule gates.

Resume bullets:
- Implemented Python Airflow Redshift analytics with explicit API contract and data schema.
- Built public multi-repo Git submodule workspace with org origin and personal mirror.
- Added CI, Docker, GitOps, observability, and dependency-light self-check gates.

Verification:
- `node scripts/self-check.mjs`
- `cd regionflow-fe && npm run self-check`
- backend self-check in `regionflow-be/scripts`
