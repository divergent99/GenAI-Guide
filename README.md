# GenAI Engineer's Guide
## the vision

most GenAI learning content is either too shallow (twitter threads, 5-minute intros) or locked behind $500 courses that teach you to wrap an API and call it a product.

this guide exists because I couldn't find one resource that went from fundamentals to production — with real architectural decisions, real tradeoffs, and real code from systems that are actually running. so I built it.

everything here comes from building production RAG services, multi-agent pipelines, text-to-SQL engines, and competitive intelligence systems at A&M GCC and now GEDU. not theory. notes from the work itself.

the goal: if you follow this guide end-to-end, you should be able to design, build, evaluate, and ship a production-grade GenAI system — and understand why you made every decision along the way.

free forever. no paywalls. no email gates. just the signal.

---

## what it covers

**learning roadmap** — a structured path from zero to production across 4 levels: foundations, building (RAG + APIs), agentic AI, and expert-level deployment and evals. follow the order. don't skip.

**12 core concepts** — LLMs, RAG, agents, embeddings, prompt engineering, fine-tuning, orchestration, evals, MCP, document processing, memory, and guardrails. each card links to the canonical resource for that topic.

**PE due diligence pipeline** — a full walkthrough of Verdikt, a real multi-agent system built for hackathon. interactive LangGraph node diagram you can run and inspect. then 5 architecture decisions deconstructed: which pattern, which model, how to parse documents, how many agents, how to measure quality. every decision shows what was rejected and why.

**the reading list** — 75+ resources across papers, courses, blogs, repos, videos, and tools. everything actually used to build production systems. no filler.

**engineer's cheatsheet** — quick reference for RAG pipelines, LangGraph patterns, prompt engineering, model selection, evals, and deployment. the stuff you forget and google at 2am.

**projects** — 13 hackathon builds, led by NovaDD (Amazon Nova hackathon winner), Flightcheck (agent that monitors agents), Tribal Knowledge Agent (Slack), Blast Radius Reviewer (GitLab), VaultDesk, Verdikt and Gemini VDR. real code, real stack decisions.

**newsletters** — 10 newsletters worth actually subscribing to, with honest notes on what each one covers and who it's for.

**the bigger picture** — deployment, use case design frameworks, the Sep 2026 model landscape (Claude Fable 5.1 / Opus 5.5, GPT-6, Gemini 3.8 Flash, open weights), and an honest take on the AI bubble.

**Jev** — a dedicated breakdown of TypeSafe's System One model: typed Choice / Score / Noul decisions, where it fits in a LangGraph pipeline, code, limits and caveats.

---

## stack

pure HTML + CSS + vanilla JS. no framework, no build step, no dependencies. Three.js for the warp background. hosted on Railway as a static site.

---

## contact

- github: [divergent99](https://github.com/divergent99)
- email: abhineetsharma77@gmail.com
- devpost: [abhineetsharma77](https://devpost.com/abhineetsharma77)
- promptbase: [akriceus](https://promptbase.com/profile/akriceus)
