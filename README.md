# RegionFlow Workspace

Regional demand analytics pipeline.

Repos:
- `regionflow-workspace`: parent workspace and submodule root.
- `regionflow-fe`: Expo app, `ky` API client.
- `regionflow-be`: Python analytics package with Airflow DAG and Redshift SQL.

Architecture:
- Airflow: daily region analytics DAG.
- Redshift: fulfillment mart aggregation.
- MySQL, Redis, RabbitMQ: shared service baseline.
- GitHub Actions + ArgoCD: CI and GitOps deployment.
- Datadog, Grafana, Sentry: logs, metrics, errors.

Resume bullets:
- Built Airflow DAG that transforms order signals into region-level stockout actions.
- Wrote Redshift aggregation boundary for demand and fulfillment analytics.
- Exposed dashboard payload compatible with shared mobile frontend.

Run:
- `docker compose up -d`
- `cd regionflow-be && python -m pytest`
- `cd regionflow-fe && npm install && npm run typecheck`
RegionFlow git submodule workspace
