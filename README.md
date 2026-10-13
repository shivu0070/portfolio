# Shivansh Thakur — portfolio

Personal portfolio for AI engineering prototypes and public-dataset analytics.

## Run locally

From the repository root, run `python -m http.server 8000` and open
http://localhost:8000. The site uses plain HTML, CSS and JavaScript; no build step.

## Maintain

- Edit content in `index.html`, behaviour in `script.js`, and presentation in `styles.css`.
- The downloadable resume is `assets/ShivanshThakur_CV.pdf`.
- Keep dates, role titles and metrics consistent with the resume and linked repositories.
- State the dataset, denominator and measurement scope with evaluation results.
- Local demos and prototypes are not evidence of production adoption or business impact.

## Evaluation notes

Invoice strict cell accuracy and unseen-invoice value matching use different scorers.
ALPR training scores measure plate detection, not OCR accuracy. Voice barge-in time
measures interruption handling, not full response latency. Router training results are documented in its linked repository.
Agent-build acceptance checks cover three published showcases.

External font/icon/animation libraries are loaded from CDNs. Core content should
remain accessible when animation is disabled. GitHub Pages publishes the configured
branch; review content before merging a publishing change.
