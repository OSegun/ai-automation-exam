# AI Academy — No-Code AI Automation Certification Exam

A single-file, proctored, 50-question certification exam for beginners in no-code AI
automation. Everything lives in `index.html` — no build step, no server, no dependencies.
Drop it on GitHub Pages and share the link.

|            |                                                       |
| ---------- | ----------------------------------------------------- |
| Questions  | 50 multiple choice, one correct answer each           |
| Time limit | 48 minutes, auto-submits at zero                      |
| Pass mark  | 70%                                                   |
| Attempts   | One                                                   |
| Proctoring | Full-screen share, fullscreen mode, violation logging |

**Topics covered:** prompt engineering (14) · n8n (11) · RAG & vector databases (8) ·
AI agents (6) · AI safety & ethics (4) · AI foundations (3) · no-code platforms incl.
Make.com (2) · image & video generation (2).

Questions are drawn from the AI Academy lecture notes: the prompt-engineering series,
agent architecture, the n8n builds (weather agent, Inbox Intelligence, WhatsApp
Intelligence), vector databases and RAG, and the AI safety & ethics session.

---

## 1. Publish it

Exam is live at
`https://<your-username>.github.io/ai-automation-exam/`

Share that link with candidates. Chrome or Edge on a laptop or desktop is required —
screen sharing is not available in most mobile browsers.

---

## 2. Collect results in a Google Sheet

By default the exam shows the score on screen and lets the candidate download a receipt.
Every submission land in a spreadsheet automatically

---

## 4. What counts as a violation

Each of these is timestamped, counted, shown live in the exam header, and included in the
submission and the receipt:

- Switching tab, minimising, or hiding the window
- Losing window focus (switching applications)
- Leaving fullscreen — the exam tries to restore it
- Stopping the screen share
- Copy, cut or paste
- Right-click
- Developer-tools, view-source, save and print shortcuts

At `MAX_VIOLATIONS` the exam submits itself and the result is marked **Flagged**.

---

## 5. Notes on integrity

The questions are base64-encoded inside `index.html` so they are not readable by simply
viewing the page source. That stops casual snooping, not a determined candidate with
developer tools — which is exactly what the screen-share requirement and the violation log
are there to catch. For higher stakes, run the exam in a supervised room or a lab session.
