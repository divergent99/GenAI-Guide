/* ─────────────────────────────────────────────
   akriceus // genai
   js/main.js
────────────────────────────────────────────── */

/* ── SMOOTH SCROLL ── */
function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── ROADMAP ACCORDION ── */
function toggleRM(header) {
  const body = header.nextElementSibling;
  const isOpen = body.classList.contains('open');
  document.querySelectorAll('.rm-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.rm-header').forEach(h => h.classList.remove('open'));
  if (!isOpen) { body.classList.add('open'); header.classList.add('open'); }
}

/* ── USE CASE DECONSTRUCTOR ACCORDION ── */
function toggleDD(step) {
  const body = step.querySelector('.dd-body');
  const toggle = step.querySelector('.dd-toggle');
  const isOpen = body.classList.contains('open');
  document.querySelectorAll('.dd-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.dd-toggle').forEach(t => { t.textContent = '+'; });
  if (!isOpen) {
    body.classList.add('open');
    toggle.textContent = '−';
  }
}

/* ── RESOURCE TABS ── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ── NAV SCROLL SPY ── */
(function () {
  const sections = ['roadmap','concepts','resources','projects','newsletters','cheatsheet','stack','contact'];
  const links = document.querySelectorAll('.nav-links a[data-section]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 80) current = id;
    });
    links.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }, { passive: true });
})();

/* ── HERO CODE WINDOW ── */
(function () {

  // Each snippet is plain text — we do syntax highlighting via regex on the full string
  const snippets = [
    {
      file: 'agent_state.py',
      lang: 'python',
      code: `LangGraph state — VaultDesk agent
from typing import TypedDict, List
from langgraph.graph import StateGraph

class AgentState(TypedDict):
    messages: List[dict]
    user_id: str
    auth_token: str
    task: str
    result: str

graph = StateGraph(AgentState)
graph.add_node("planner", planner_node)
graph.add_node("executor", executor_node)
graph.add_node("responder", responder_node)
graph.add_conditional_edges(
    "planner",
    route_task,
    {
        "execute": "executor",
        "respond": "responder"
    }
)
graph.set_entry_point("planner")
app = graph.compile(checkpointer=memory)`
    },
    {
      file: 'rag_pipeline.py',
      lang: 'python',
      code: `RAG pipeline — Docling + ChromaDB
import chromadb
from docling.document_converter import DocumentConverter

def build_rag(pdf_path: str) -> None:
    # 1. parse with structure awareness
    converter = DocumentConverter()
    doc = converter.convert(pdf_path)

    # 2. semantic chunking
    chunks = semantic_chunk(
        doc.text,
        size=512,
        overlap=50
    )

    # 3. embed + store
    client = chromadb.PersistentClient("./db")
    col = client.get_or_create_collection(
        "pe_docs",
        embedding_function=openai_ef
    )
    col.add(
        documents=chunks,
        ids=[f"chunk_{i}" for i in range(len(chunks))]
    )`
    },
    {
      file: 'model_router.py',
      lang: 'python',
      code: `tiered model selection — Apr 2026
from enum import Enum

class TaskType(Enum):
    ROUTING      = "routing"
    ANALYSIS     = "deep_analysis"
    CODE         = "code"
    REASONING    = "hard_reasoning"
    GENERAL      = "general"

def route_model(task: TaskType) -> str:
    match task:
        case TaskType.ROUTING:
            # fast, cheap — classification only
            return "claude-haiku-4-5-20251001"

        case TaskType.ANALYSIS:
            # doc analysis, long context
            return "claude-sonnet-4-6"

        case TaskType.CODE:
            # best for agentic coding
            return "gpt-4.1"  # 1M ctx, top SWE-bench

        case TaskType.REASONING:
            # math, science, hard problems
            return "o3"  # or claude-opus-4-6

        case _:
            # open source, cost = $0
            return "llama-3.3-70b-groq"`
    },
    {
      file: 'eval_pipeline.py',
      lang: 'python',
      code: `RAGAS eval — ship with confidence
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    context_precision,
    answer_relevancy
)
from datasets import Dataset

# 20 golden test cases
test_cases = Dataset.from_list(golden_qa)

result = evaluate(
    dataset=test_cases,
    metrics=[
        faithfulness,        # grounded in source?
        context_precision,   # right chunks retrieved?
        answer_relevancy     # actually answers Q?
    ]
)

# thresholds before shipping
assert result["faithfulness"]      > 0.85
assert result["context_precision"] > 0.80
assert result["answer_relevancy"]  > 0.82
print("✓ evals passed — ready to ship")`
    },
  ];

  const codeEl  = document.getElementById('hcw-code');
  const fileEl  = document.getElementById('hcw-filename');
  const langEl  = document.getElementById('hcw-lang');
  const bodyEl  = document.getElementById('hcw-body');
  if (!codeEl) return;

  // syntax highlight a plain text python snippet into HTML
  function highlight(code) {
    // escape HTML first
    let s = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // order matters — comments first, then strings, then keywords
    s = s.replace(/(#[^\n]*)/g,                           '<span class="cm">$1</span>');
    s = s.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')/g, '<span class="st">$1</span>');
    s = s.replace(/\b(from|import|def|class|return|if|elif|else|for|in|not|and|or|True|False|None|match|case|assert|print)\b/g, '<span class="kw">$1</span>');
    s = s.replace(/\b([A-Z][A-Za-z0-9_]+)\b/g,           '<span class="cl">$1</span>');
    s = s.replace(/\b(str|int|float|bool|list|dict|List|Dict|Optional|Any)\b/g, '<span class="nm">$1</span>');
    s = s.replace(/\b(\d+(\.\d+)?)\b/g,                  '<span class="nm">$1</span>');
    // function calls — word followed by (
    s = s.replace(/\b([a-z_][a-z0-9_]*)(?=\()/g,         '<span class="fn">$1</span>');

    return s;
  }

  let currentSnippet = 0;
  let typeInterval   = null;
  let charIndex      = 0;
  let isTransitioning = false;

  function loadSnippet(idx, animate) {
    const s = snippets[idx];
    fileEl.textContent = s.file;
    langEl.textContent = s.lang;

    if (!animate) {
      codeEl.innerHTML = highlight(s.code);
      bodyEl.scrollTop = 0;
      return;
    }

    // type character by character into a plain text buffer, then highlight on each frame
    codeEl.innerHTML = '';
    charIndex = 0;
    if (typeInterval) clearInterval(typeInterval);

    typeInterval = setInterval(() => {
      if (charIndex >= s.code.length) {
        clearInterval(typeInterval);
        typeInterval = null;
        return;
      }
      charIndex += 2; // two chars per tick for snappier feel
      const partial = s.code.slice(0, charIndex);
      codeEl.innerHTML = highlight(partial);
      // auto-scroll to bottom as code types
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }, 22);
  }

  // initial load — no animation on first render to avoid jank
  loadSnippet(0, false);

  // cycle every 7s
  setInterval(() => {
    if (isTransitioning) return;
    isTransitioning = true;
    bodyEl.style.opacity = '0';
    bodyEl.style.transition = 'opacity 0.3s';

    setTimeout(() => {
      currentSnippet = (currentSnippet + 1) % snippets.length;
      loadSnippet(currentSnippet, true);
      bodyEl.style.opacity = '1';
      isTransitioning = false;
    }, 320);
  }, 7000);

})();

/* ── TERMINAL TYPEWRITER ── */
(function () {
  const lines = [
    'ls ./projects --filter=hackathon',
    '> vaultdesk/  novaDD/  verdikt/  gemini-vdr/',
    'cat ./stack | head -5',
    '> langgraph  chromadb  bedrock  fastapi  docling',
    'python -m pytest tests/evals/ -v --tb=short',
    '> 47 passed, 0 failed  —  ship it.',
    'git push origin main && railway up',
    '> deployed in 18s  —  live at akriceus.dev',
  ];
  let li = 0, ci = 0, phase = 'type';
  const el  = document.getElementById('typed-cmd');
  if (!el) return;
  setInterval(() => {
    if (phase === 'type') {
      if (ci < lines[li].length) { el.textContent += lines[li][ci++]; }
      else { phase = 'wait'; setTimeout(() => { phase = 'clear'; }, 2000); }
    } else if (phase === 'clear') {
      if (el.textContent.length > 0) { el.textContent = el.textContent.slice(0, -1); }
      else { li = (li + 1) % lines.length; ci = 0; phase = 'type'; }
    }
  }, 52);
})();

/* ── CONTACT FORM → mailto ── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const topic   = document.getElementById('cf-topic').value;
    const message = document.getElementById('cf-message').value.trim();
    const subject = encodeURIComponent(`[akriceus] ${topic} — ${name}`);
    const body    = encodeURIComponent(`Hi Abhineet,\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}\n\n---\nSent via akriceus.dev`);
    window.location.href = `mailto:abhineetsharma77@gmail.com?subject=${subject}&body=${body}`;
  });
})();


/* ── VERDIKT SVG PIPELINE ── */
(function () {

  const NODE_DATA = {
    input: {
      accent: '#4ade80', name: 'CIM Document', role: 'raw input · PDF upload',
      model: '—', tools: 'FastAPI /upload · multipart form',
      what: `A Confidential Information Memorandum is the entry point for any PE deal. Typically 80–200 pages of dense PDF — company overview, market sizing, 3 years of P&L, balance sheet, cash flow, management bios, customer concentration, and growth thesis.

The raw PDF is uploaded via FastAPI. It goes nowhere useful until Docling parses it — pypdf would strip all table structure and return a flat text blob, destroying 40% of the signal before any LLM sees it.`,
      input: `file: AcmeCo_CIM_2026.pdf
size: 42 MB  |  pages: 184
tables: 38 financial tables
charts: 12 embedded figures`,
      output: `→ binary stream to Docling
→ no preprocessing at this stage
→ metadata stored:
  filename, upload_ts, deal_id`,
    },
    docling: {
      accent: '#fb923c', name: 'Docling Parser', role: 'structure-aware document processing',
      model: 'IBM Docling v2', tools: 'DocumentConverter · RecursiveCharacterTextSplitter · text-embedding-3-small',
      what: `Docling is the reason the pipeline works. Unlike pypdf, it preserves table structure (critical for financial data — revenue tables, EBITDA bridges, debt schedules), section hierarchy, headings as metadata, figure captions, and footnotes.

Chunks are created at 512 tokens with 50-token overlap using semantic boundaries. Each chunk carries source metadata (section title, page number) so retrieval context is richer. Chunks are embedded with text-embedding-3-small and stored in ChromaDB.`,
      input: `AcmeCo_CIM_2026.pdf
184 pages · 38 tables
42MB binary stream`,
      output: `342 chunks created
<g>✓ 38 tables → structured JSON</g>
<g>✓ section headers as metadata</g>
<g>✓ chunk_size=512, overlap=50</g>

→ embedded: text-embedding-3-small
→ ChromaDB: "acmeco_cim_2026"
→ 342 vectors stored`,
    },
    supervisor: {
      accent: '#6366f1', name: 'Supervisor Agent', role: 'orchestrator · LangGraph StateGraph',
      model: 'Claude Sonnet 4.6', tools: 'LangGraph StateGraph · add_conditional_edges · interrupt_before',
      what: `The supervisor is the orchestrator. It receives the task and decomposes it into parallel subtasks — Researcher and Analyst run concurrently via LangGraph's async node execution, cutting total latency by ~40%.

AgentState is a TypedDict shared across all nodes: messages, cim_collection, task, researcher_output, analyst_output, report. Conditional edges route to Writer only when both specialist outputs are non-null. interrupt_before=["writer"] is available for human-in-the-loop review before report generation.`,
      input: `AgentState {
  cim_collection: "acmeco_cim_2026"
  task: "full due diligence report
         for AcmeCo acquisition"
  researcher_output: None
  analyst_output: None
}`,
      output: `<v>→ researcher</v>: "find market data,
   competitive landscape, recent
   news, customer concentration"

<v>→ analyst</v>: "extract financials,
   compute ratios, assess risks,
   validate against CIM tables"

<c>[ parallel execution via async ]</c>`,
    },
    researcher: {
      accent: '#22d3ee', name: 'Researcher Agent', role: 'dual-source information retrieval',
      model: 'Groq LLaMA 3.3 70b', tools: 'Tavily Search API · ChromaDB semantic retrieval · hybrid BM25+semantic',
      what: `Dual-source retrieval: semantic search over the CIM chunks in ChromaDB for internal data, plus live Tavily web search for external context — recent news, competitor M&A activity, market forecasts, regulatory developments.

Groq + LLaMA 3.3 70b is used here for speed (~300 tok/sec via LPU inference). This agent doesn't require deep reasoning — it needs fast retrieval and structured summarisation. All outputs include source citations with chunk IDs and URLs.`,
      input: `task: "find market data,
competitive landscape, recent
news, customer concentration"

chromadb: "acmeco_cim_2026"
tavily: enabled (live web)`,
      output: `ChromaDB → 12 relevant chunks
  market_size: "$4.2B TAM (2025)"
  growth_rate: "12.3% CAGR"
  top_3_customers: "42% revenue"

Tavily → 8 web sources
  <c>TechCrunch (2025-11)</c>: Series C
  <c>Bloomberg (2026-01)</c>: competitor
    M&A rumour confirmed

<g>20 sources cited · ResearchOutput{}</g>`,
    },
    analyst: {
      accent: '#a78bfa', name: 'Analyst Agent', role: 'financial reasoning · risk assessment',
      model: 'Claude Sonnet 4.6', tools: 'Pydantic FinancialModel · ratio engine · risk matrix',
      what: `The analyst reads structured financial tables from Docling and performs quantitative analysis. Claude Sonnet 4.6 is chosen over Groq here because financial reasoning requires precise arithmetic — LLaMA 3.3 70b tends to make rounding errors on compound calculations.

Output is a Pydantic-validated FinancialModel — schema validation happens on every field. If revenue CAGR can't be computed due to missing data, it's flagged as null rather than fabricated. The risk matrix uses a RED/AMBER/GREEN scoring rubric encoded in the system prompt.`,
      input: `Docling financial tables:
  FY2023 Revenue:  $28.4M
  FY2024 Revenue:  $34.1M
  FY2025 Revenue:  $41.2M
  FY2025 EBITDA:   $4.2M
  FY2025 Debt:     $8.0M TL`,
      output: `<g>FinancialModel validated ✓</g>
  revenue_cagr_2y:  <c>20.4%</c>
  ebitda_margin:    <v>10.2%</v>
  net_debt_ebitda:  <o>1.16x</o>

RiskMatrix:
  <g>GREEN</g>  growth trajectory
  <o>AMBER</o>  margin compression (+18%)
  <o>AMBER</o>  customer concentration 42%
  <r>RED</r>    key-person risk (founder=CTO)
  <r>RED</r>    $8M debt covenant risk`,
    },
    writer: {
      accent: '#f472b6', name: 'Writer Agent', role: 'structured report synthesis',
      model: 'Claude Sonnet 4.6', tools: 'Pydantic DDReport · .with_structured_output() · retry logic',
      what: `The writer synthesises Researcher and Analyst outputs into a structured report following the A&M PoV DD template. Uses .with_structured_output(DDReport) — if any of the 8 required sections fails Pydantic validation, it triggers a correction prompt and retries (max 3 attempts).

Zero hallucination policy: the writer is instructed not to introduce information not present in researcher_output or analyst_output. Every financial figure references a specific chunk ID. The Pydantic schema enforces this — any field marked requires_citation raises a validation error if no source is attached.`,
      input: `researcher_output: ResearchOutput{
  market_data, competitors, news
  20 source citations, chunk_ids
}
analyst_output: FinancialModel{
  ratios, risk_matrix, validated
}
template: A&M PoV DD (8 sections)`,
      output: `<g>DDReport validated ✓ (8/8 sections)</g>

  <c>1.</c> Executive Summary
  <c>2.</c> Business Overview
  <c>3.</c> Market & Competitive Analysis
  <c>4.</c> Financial Performance
     revenue_cagr: 20.4%
  <c>5.</c> Risk Assessment (4 risks)
  <c>6.</c> Management & Organisation
  <c>7.</c> Investment Thesis
  <c>8.</c> Key Diligence Items`,
    },
    output: {
      accent: '#4ade80', name: 'DD Report', role: 'final output · Plotly Dash + PDF export',
      model: '—', tools: 'Plotly Dash · python-pptx · PDF renderer',
      what: `The complete, validated due diligence report. 8 sections, all claims source-attributed, financial model Pydantic-validated, risk matrix scored RED/AMBER/GREEN.

Rendered in a Plotly Dash UI with section navigation, expandable source citations (click any financial figure to see the source CIM chunk), and export to PDF or PPTX using the A&M PowerPoint template via python-pptx.

Total pipeline: ~90 seconds end-to-end. A senior analyst doing this manually would spend 40–60 hours.`,
      input: `DDReport{} object from Writer
8 sections · all Pydantic-validated
20+ source citations attached
risk_matrix with severity scores`,
      output: `Total time: <c>~90 seconds</c>
vs. manual: <r>40–60 hours</r>

Export formats:
  → Plotly Dash interactive
  → PDF (section-navigable)
  → PPTX (A&M template)

<g>✓ 0 hallucinations (schema-enforced)</g>
<g>✓ 100% source attribution</g>
<g>✓ Pydantic validation all fields</g>`,
    },
  };

  /* ── edge definitions: id → {el, x1,y1,x2,y2 or path} ── */
  const EDGE_IDS = ['vpe-0','vpe-1','vpe-2','vpe-3','vpe-4','vpe-5','vpe-6'];

  /* ── animation sequence ── */
  const SEQUENCE = [
    { node: 'input',      edges: [],              dur: 500  },
    { node: 'docling',    edges: ['vpe-0'],        dur: 900  },
    { node: 'supervisor', edges: ['vpe-1'],        dur: 800  },
    { node: 'researcher', edges: ['vpe-2'],        dur: 1000 },
    { node: 'analyst',    edges: ['vpe-3'],        dur: 1000 },
    { node: 'writer',     edges: ['vpe-4','vpe-5'],dur: 900  },
    { node: 'output',     edges: ['vpe-6'],        dur: 600  },
  ];

  let isRunning = false, timerIv = null, elapsed = 0;

  /* ── helpers to set SVG element classes ── */
  function nodeEl(id) { return document.getElementById('vpn-' + id); }
  function edgeEl(id) { return document.getElementById(id); }

  function setNodeState(id, state) {
    const el = nodeEl(id);
    if (!el) return;
    el.classList.remove('active','running','done');
    if (state) el.classList.add(state);
    // swap arrow marker
    const rect = el.querySelector('.vp-nrect');
    if (rect && state === 'running') rect.setAttribute('filter','url(#glow-cyan)');
    else if (rect) rect.removeAttribute('filter');
  }

  function setEdgeState(id, state) {
    const el = edgeEl(id);
    if (!el) return;
    el.classList.remove('vp-edge-active','vp-edge-done','vp-edge-cyan');
    // update marker-end based on state
    if (state === 'active') {
      el.classList.add('vp-edge-active');
      el.setAttribute('marker-end','url(#arr-active)');
    } else if (state === 'done') {
      el.classList.add('vp-edge-done');
      el.setAttribute('marker-end','url(#arr-done)');
    } else {
      el.setAttribute('marker-end','url(#arr-idle)');
    }
  }

  /* ── animate a pulse dot along an edge ── */
  function pulseDot(edgeIdx) {
    const svg   = document.getElementById('vp-svg');
    const edgeEl_= document.getElementById('vpe-' + edgeIdx);
    if (!edgeEl_ || !svg) return;

    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('r','5');
    dot.setAttribute('fill','#22d3ee');
    dot.setAttribute('opacity','0.9');
    svg.appendChild(dot);

    const isLine = edgeEl_.tagName === 'line';
    const duration = 600;
    const start = performance.now();

    function getPoint(t) {
      if (isLine) {
        const x1 = parseFloat(edgeEl_.getAttribute('x1'));
        const y1 = parseFloat(edgeEl_.getAttribute('y1'));
        const x2 = parseFloat(edgeEl_.getAttribute('x2'));
        const y2 = parseFloat(edgeEl_.getAttribute('y2'));
        return { x: x1 + (x2-x1)*t, y: y1 + (y2-y1)*t };
      } else {
        // path — use getTotalLength + getPointAtLength
        const len = edgeEl_.getTotalLength();
        const pt  = edgeEl_.getPointAtLength(len * t);
        return { x: pt.x, y: pt.y };
      }
    }

    function animate(now) {
      const t = Math.min((now - start) / duration, 1);
      const p = getPoint(t);
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      dot.setAttribute('opacity', t < 0.9 ? '0.9' : String(1 - (t-0.9)/0.1));
      if (t < 1) requestAnimationFrame(animate);
      else svg.removeChild(dot);
    }
    requestAnimationFrame(animate);
  }

  /* ── select node ── */
  window.vpSelect = function(id) {
    // clear all active
    ['input','docling','supervisor','researcher','analyst','writer','output']
      .forEach(n => {
        const el = nodeEl(n);
        if (el && !el.classList.contains('running') && !el.classList.contains('done'))
          el.classList.remove('active');
        else if (el) el.classList.remove('active');
      });
    const el = nodeEl(id);
    if (el) {
      el.classList.remove('running','done');
      el.classList.add('active');
    }
    renderDetail(id);
  };

  function colorize(t) {
    return t
      .replace(/<c>(.*?)<\/c>/gs, '<span class="c">$1</span>')
      .replace(/<g>(.*?)<\/g>/gs, '<span class="g">$1</span>')
      .replace(/<v>(.*?)<\/v>/gs, '<span class="v">$1</span>')
      .replace(/<o>(.*?)<\/o>/gs, '<span class="o">$1</span>')
      .replace(/<r>(.*?)<\/r>/gs, '<span class="r">$1</span>');
  }

  function renderDetail(id) {
    const n = NODE_DATA[id];
    document.getElementById('vp-detail-inner').innerHTML = `
      <div class="vpd-header">
        <div class="vpd-badge" style="background:${n.accent}18;border:1px solid ${n.accent}44;color:${n.accent}">
          ${id.substring(0,3).toUpperCase()}
        </div>
        <div>
          <div class="vpd-name">${n.name}</div>
          <div class="vpd-role">${n.role}</div>
          <div class="vpd-model">model: ${n.model}</div>
          <div class="vpd-tools">tools: ${n.tools}</div>
        </div>
      </div>
      <div class="vpd-body">
        <div class="vpd-col"><div class="vpd-col-title">what it does</div><div class="vpd-text">${n.what}</div></div>
        <div class="vpd-col"><div class="vpd-col-title">input</div><div class="vpd-text">${colorize(n.input)}</div></div>
        <div class="vpd-col"><div class="vpd-col-title">output</div><div class="vpd-text">${colorize(n.output)}</div></div>
      </div>`;
  }

  /* ── run animation ── */
  window.vpRun = function() {
    if (isRunning) return;
    isRunning = true; elapsed = 0;
    const btn = document.getElementById('vp-run-btn');
    const timerEl = document.getElementById('vp-timer');
    btn.disabled = true;
    document.getElementById('vp-run-label').textContent = 'running...';

    // reset all
    ['input','docling','supervisor','researcher','analyst','writer','output'].forEach(n => setNodeState(n, null));
    EDGE_IDS.forEach(id => setEdgeState(id, null));

    timerIv = setInterval(() => { elapsed += 100; timerEl.textContent = (elapsed/1000).toFixed(1) + 's'; }, 100);

    let delay = 0;
    SEQUENCE.forEach((step, i) => {
      setTimeout(() => {
        step.edges.forEach(eid => {
          setEdgeState(eid, 'active');
          const idx = parseInt(eid.replace('vpe-',''));
          pulseDot(idx);
        });
        setNodeState(step.node, 'running');
        renderDetail(step.node);
        // highlight node as active in graph
        const el = nodeEl(step.node);
        if (el) el.classList.add('running');
      }, delay);

      setTimeout(() => {
        step.edges.forEach(eid => setEdgeState(eid, 'done'));
        setNodeState(step.node, 'done');
        if (i === SEQUENCE.length - 1) {
          clearInterval(timerIv);
          isRunning = false;
          btn.disabled = false;
          document.getElementById('vp-run-label').textContent = 'run again';
        }
      }, delay + step.dur);

      delay += step.dur;
    });
  };

  window.vpReset = function() {
    if (isRunning) return;
    clearInterval(timerIv);
    ['input','docling','supervisor','researcher','analyst','writer','output'].forEach(n => setNodeState(n, null));
    EDGE_IDS.forEach(id => setEdgeState(id, null));
    document.getElementById('vp-timer').textContent = '';
    document.getElementById('vp-run-label').textContent = 'run pipeline';
    document.getElementById('vp-detail-inner').innerHTML = '<div class="vp-detail-empty">— click any node to inspect it —</div>';
  };

  // default
  setTimeout(() => vpSelect('supervisor'), 200);
})();