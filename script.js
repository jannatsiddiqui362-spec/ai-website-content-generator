/* ============================================================
   AI WEBSITE CONTENT GENERATOR — script.js
   Handles: theme, generation, render, copy, download, history
============================================================ */

/* ============================================================
   STATE
============================================================ */
let tone = 'Professional';  // Currently selected tone
let variations = [];         // Array of 3 generated variation objects
let activeVar = 0;           // Currently viewed variation index
const MAX_HISTORY = 5;       // Max history entries saved

/* ============================================================
   THEME TOGGLE
============================================================ */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeLabel  = document.getElementById('themeLabel');

themeToggle.addEventListener('click', () => {
  const isDark = html.dataset.theme !== 'dark';
  html.dataset.theme = isDark ? 'dark' : 'light';
  themeLabel.textContent = isDark ? 'Dark' : 'Light';
  localStorage.setItem('acg_theme', isDark ? 'dark' : 'light');
});

// Apply saved theme on page load
(function initTheme() {
  const saved = localStorage.getItem('acg_theme');
  if (saved === 'dark') {
    html.dataset.theme = 'dark';
    themeLabel.textContent = 'Dark';
  }
})();

/* ============================================================
   CHARACTER COUNTER (Website Type input)
============================================================ */
const wtInput  = document.getElementById('websiteType');
const typeCount = document.getElementById('typeCount');

wtInput.addEventListener('input', () => {
  typeCount.textContent = wtInput.value.length;
});

/* ============================================================
   TONE SELECTOR
============================================================ */
document.getElementById('toneGroup').addEventListener('click', e => {
  const btn = e.target.closest('.tone-btn');
  if (!btn) return;
  document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  tone = btn.dataset.tone;
});

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ============================================================
   ERROR MESSAGE
============================================================ */
function showErr(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 4500);
}

/* ============================================================
   CONTENT ENGINE — Tone map & variation builder
============================================================ */
const toneMap = {
  Professional: {
    adj: ['professional', 'reliable', 'trusted', 'expert', 'certified'],
    tagline_suf: 'Excellence Delivered.'
  },
  Friendly: {
    adj: ['friendly', 'welcoming', 'caring', 'personable', 'warm'],
    tagline_suf: 'People First, Always.'
  },
  Luxury: {
    adj: ['exclusive', 'premium', 'bespoke', 'distinguished', 'elite'],
    tagline_suf: 'Uncompromising Excellence.'
  },
  Casual: {
    adj: ['laid-back', 'fun', 'honest', 'real', 'down-to-earth'],
    tagline_suf: 'Keeping It Real.'
  }
};

// Helper: pick item from array by index (cycles)
function pick(arr, i) { return arr[i % arr.length]; }

/**
 * Build one complete content variation.
 * @param {string} type     - Website type (e.g. "Bakery")
 * @param {string} biz      - Business name
 * @param {string} aud      - Target audience
 * @param {string} loc      - Location
 * @param {string} t        - Tone
 * @param {number} vi       - Variation index (0, 1, 2)
 */
function buildVariation(type, biz, aud, loc, t, vi) {
  const tm       = toneMap[t];
  const adj      = pick(tm.adj, vi);
  const Adj      = adj[0].toUpperCase() + adj.slice(1);
  const name     = biz || `${type} Pro`;
  const location = loc ? ` in ${loc}` : '';
  const audience = aud || 'businesses and individuals';

  /* ---------- META ---------- */
  const titles = [
    `${name} — ${tm.tagline_suf}`,
    `The ${Adj} Choice for ${type}${location}.`,
    `Redefining ${type} for ${audience}.`
  ];
  const metaDescs = [
    `${name} offers ${adj} ${type.toLowerCase()} services${location} for ${audience}. Discover our full range of solutions today.`,
    `Looking for a ${adj} ${type.toLowerCase()} partner${location}? ${name} delivers results that matter to ${audience}.`,
    `${name} — your trusted ${type.toLowerCase()} experts${location}. Serving ${audience} with dedication and expertise.`
  ];

  /* ---------- HERO ---------- */
  const heroHeadings = [
    `${Adj} ${type} Solutions Built for ${audience}`,
    `Your ${Adj} ${type} Partner${location} Starts Here`,
    `We Help ${audience} Achieve More Through ${Adj} ${type}`
  ];
  const heroSubs = [
    `At ${name}, we combine deep expertise with a ${adj} approach to deliver ${type.toLowerCase()} experiences that exceed expectations. Whether you're just starting out or scaling up, we're here every step of the way.`,
    `${name} is more than a ${type.toLowerCase()} provider — we're a dedicated partner committed to the success of ${audience}${location}. Our ${adj} team is ready to bring your vision to life.`,
    `From day one, ${name} has stood for quality, integrity, and results. We serve ${audience}${location} with a level of ${type.toLowerCase()} excellence that sets us apart.`
  ];

  /* ---------- ABOUT ---------- */
  const abouts = [
    `Founded with a clear vision, ${name} has grown into one of the most ${adj} names in ${type.toLowerCase()}${location}. Our journey began when we recognized that ${audience} deserved better — more transparent, more dedicated, and more impactful ${type.toLowerCase()} services.\n\nToday, our team of seasoned professionals brings together decades of combined experience, a passion for innovation, and an unwavering commitment to client success. We don't just deliver services — we build partnerships that drive long-term growth.\n\nOur mission is simple: to empower ${audience} with the tools, expertise, and support they need to thrive. Every decision we make is guided by our core values of integrity, excellence, and collaboration.`,
    `${name} was born out of a desire to do ${type.toLowerCase()} differently. We saw an industry where ${audience} were underserved, and we decided to change that — one client at a time.\n\nSince our founding, we have built a reputation for delivering measurable results and exceptional client experiences. Our team is diverse, dedicated, and deeply invested in the communities we serve${location}.\n\nWe believe that great ${type.toLowerCase()} is about more than transactions — it's about relationships. That's why we take the time to truly understand each client's unique needs and craft solutions that are as individual as they are.`,
    `The story of ${name} is one of purpose and passion. We started small, with a big belief: that ${audience} deserve a ${type.toLowerCase()} partner who genuinely cares about their success.\n\nOver the years, we've refined our approach, expanded our expertise, and built a culture that puts clients at the center of everything we do. Our ${adj} team works tirelessly to stay ahead of industry trends so you always have access to the best solutions available.\n\nWe are proud to serve ${audience}${location} and remain committed to the values that have guided us from the very beginning: honesty, quality, and relentless pursuit of excellence.`
  ];

  /* ---------- SERVICES ---------- */
  const servicesSets = [
    [
      { name: `Custom ${type} Strategy`,   desc: `We design personalized ${type.toLowerCase()} strategies aligned with your specific goals, budget, and audience.` },
      { name: 'Full-Service Consultation', desc: `Our experienced consultants provide end-to-end guidance, from initial planning through execution.` },
      { name: 'Implementation & Execution',desc: `Our team handles every detail of implementation so you can focus on what you do best.` },
      { name: 'Performance Monitoring',    desc: `We track key metrics and provide transparent reporting so you always know how your investment is performing.` },
      { name: 'Ongoing Support',           desc: `We provide continuous support, regular reviews, and proactive optimizations to keep you ahead.` },
      { name: 'Training & Empowerment',    desc: `We equip your team with the knowledge and tools they need to sustain success long after our engagement.` }
    ],
    [
      { name: `${type} Needs Assessment`,  desc: `We begin every engagement with a thorough assessment to understand your challenges and opportunities.` },
      { name: 'Tailored Solution Design',  desc: `Based on your assessment, we craft bespoke solutions that address your specific pain points.` },
      { name: 'Project Management',        desc: `Our dedicated project managers ensure every initiative is delivered on time and to the highest standard.` },
      { name: 'Quality Assurance',         desc: `Every deliverable undergoes rigorous quality review before reaching you.` },
      { name: 'Client Success Management', desc: `A dedicated success manager is assigned to your account, providing personalized attention.` },
      { name: 'Growth & Scaling Support',  desc: `As your needs evolve, we scale our services with you, providing resources to match your ambitions.` }
    ],
    [
      { name: 'Discovery & Research',      desc: `We invest time in deeply understanding your market and target audience before recommending any action.` },
      { name: 'Strategic Planning',        desc: `Our strategists develop detailed roadmaps aligning ${type.toLowerCase()} initiatives with your business objectives.` },
      { name: 'Creative Development',      desc: `Our creative team develops compelling content and messaging that resonates with ${audience}.` },
      { name: 'Technology Integration',    desc: `We leverage the latest tools to streamline your ${type.toLowerCase()} operations.` },
      { name: 'Analytics & Reporting',     desc: `Data-driven insights at the core of everything we do — clear, actionable analytics for smarter decisions.` },
      { name: 'Long-Term Partnership',     desc: `We view every client relationship as a long-term partnership, committed to growing with you.` }
    ]
  ];

  /* ---------- WHY CHOOSE US ---------- */
  const whySets = [
    [
      { title: 'Proven Track Record',        desc: `${name} consistently delivers results that exceed expectations. Our portfolio speaks for itself.` },
      { title: 'Client-First Philosophy',    desc: `Every decision we make is driven by what's best for our clients. Your success is our success.` },
      { title: 'Experienced Team',           desc: `Our professionals bring decades of combined expertise across ${type.toLowerCase()} and related disciplines.` },
      { title: 'Transparent Communication', desc: `We keep you informed at every stage with honest updates, clear timelines, and no hidden surprises.` }
    ],
    [
      { title: 'Tailored Solutions',   desc: `We don't believe in cookie-cutter approaches. Every solution is crafted specifically for your needs.` },
      { title: 'Fast Turnaround',      desc: `We respect your time. Our streamlined processes ensure quality results without unnecessary delays.` },
      { title: 'Industry Expertise',   desc: `Our deep knowledge of the ${type.toLowerCase()} landscape means you benefit from insights others don't have.` },
      { title: 'Measurable Results',   desc: `We set clear KPIs and hold ourselves accountable. If it can't be measured, we don't count it.` }
    ],
    [
      { title: 'Innovation-Led',       desc: `We constantly invest in new tools and research to ensure clients always have cutting-edge solutions.` },
      { title: 'Competitive Pricing',  desc: `Premium quality doesn't require premium prices. Exceptional value for ${audience} at every budget level.` },
      { title: 'End-to-End Service',   desc: `From strategy to execution to support, we handle everything — no juggling multiple vendors.` },
      { title: 'Long-Term Focus',      desc: `We build relationships designed to last. Our goal is to be your ${type.toLowerCase()} partner for years to come.` }
    ]
  ];

  /* ---------- TESTIMONIALS ---------- */
  const testimonialSets = [
    [
      { name: 'Sarah Mitchell', role: 'CEO, Innovate Co.',     text: `Working with ${name} was a turning point for our business. Their ${adj} approach helped us achieve results we didn't think were possible in such a short time.` },
      { name: 'James Thornton', role: 'Operations Director',   text: `The team at ${name} went above and beyond at every stage. Their communication was excellent and deliverables consistently outstanding.` },
      { name: 'Priya Sharma',   role: 'Founder, GrowthLab',   text: `I've worked with many ${type.toLowerCase()} providers before, but ${name} stands out for their genuine care, attention to detail, and exceptional results.` }
    ],
    [
      { name: 'David Okafor',   role: 'Marketing Manager',     text: `${name} delivered everything they promised and more. Our goals were met ahead of schedule and the quality was second to none.` },
      { name: 'Emma Chen',      role: 'Small Business Owner',  text: `As a first-time client I was nervous, but ${name} made the entire process smooth and stress-free. I couldn't be happier with the outcome.` },
      { name: 'Carlos Ramirez', role: 'VP of Strategy',        text: `The ${name} team truly understands what ${audience} need. Their insights have had a lasting positive impact on our operations.` }
    ],
    [
      { name: 'Natalie Brooks',  role: 'Product Lead',          text: `From our first meeting it was clear ${name} was different. They listened carefully, asked the right questions, and delivered a perfectly tailored solution.` },
      { name: 'Rajan Patel',    role: 'COO, ScaleUp Inc.',     text: `Exceptional service, exceptional results. ${name} has become an indispensable partner and we look forward to continuing our relationship.` },
      { name: 'Leila Hassan',   role: 'Director of Growth',    text: `If you're looking for a ${adj} ${type.toLowerCase()} partner that truly delivers, look no further than ${name}. They've exceeded our expectations at every turn.` }
    ]
  ];

  /* ---------- FAQ ---------- */
  const faqSets = [
    [
      { q: `What makes ${name} different from other ${type.toLowerCase()} providers?`,  a: `${name} combines ${adj} expertise with a deeply personalized approach. We don't offer off-the-shelf solutions — every engagement is tailored specifically to your needs.` },
      { q: 'How long does it take to see results?',                                     a: `Most clients begin to see meaningful results within the first 30 to 60 days. We set clear milestones so you always know what to expect.` },
      { q: 'What industries do you work with?',                                         a: `We have experience across a wide range of industries and adapt our expertise to virtually any sector.` },
      { q: 'Do you offer customized pricing?',                                          a: `Absolutely. Contact us for a free consultation and we'll develop a package that delivers maximum value within your budget.` },
      { q: 'What does the onboarding process look like?',                               a: `After an initial consultation, we conduct a detailed needs assessment, align on goals and timelines, then kick off with a structured launch plan.` }
    ],
    [
      { q: `Is ${name} the right fit for ${audience}?`,                 a: `We specialize in serving ${audience} and have deep experience understanding the unique challenges this group faces.` },
      { q: 'Can we start with a smaller engagement before committing?', a: `Yes. Many clients start with a pilot project to get a feel for our team and approach before scaling up.` },
      { q: 'How do you measure success?',                               a: `We establish clear, measurable KPIs at the start of every engagement and provide regular reporting throughout.` },
      { q: 'What support is available after project completion?',       a: `We offer ongoing support options, from dedicated account management to ad-hoc consulting.` },
      { q: `How do I get started with ${name}?`,                        a: `Simply reach out via our contact form, call us, or send an email. We'll schedule a free initial consultation.` }
    ],
    [
      { q: `What is ${name}'s core philosophy?`,                                        a: `Put the client first. Every decision — from how we structure our team to how we price our services — is guided by what's best for the people we serve.` },
      { q: 'Are there any long-term contracts required?',                               a: `We believe in earning your continued trust through results, not locking you into contracts. We offer flexible engagement models.` },
      { q: `How experienced is the ${name} team?`,                                     a: `Our team brings a diverse range of backgrounds, with many holding advanced qualifications and decades of hands-on experience.` },
      { q: 'Can you handle large-scale or complex projects?',                           a: `Absolutely. We have successfully managed large-scale, multi-faceted engagements and scale our resources to match every project.` },
      { q: 'How do you handle confidentiality and data security?',                     a: `We take confidentiality and data security extremely seriously, handling all information in strict accordance with industry best practices.` }
    ]
  ];

  /* ---------- CONTACT ---------- */
  const contactIntros = [
    `Ready to take the next step? We'd love to hear from you. Whether you have a specific project in mind or simply want to explore how ${name} can help, our team is standing by and happy to assist.`,
    `Have a question or ready to get started? Reaching out to ${name} is easy. Fill out the form, give us a call, or send an email — we typically respond within one business day.`,
    `Your ${adj} ${type.toLowerCase()} journey begins with a conversation. Contact the ${name} team today and let's explore how we can help ${audience} achieve their goals.`
  ];

  /* ---------- CTA ---------- */
  const ctaHeadings = [
    `Ready to Get Started with ${name}?`,
    `Take the First Step Toward ${Adj} ${type}`,
    `Let's Build Something Great Together`
  ];
  const ctaBodies = [
    `Join hundreds of satisfied ${audience} who trust ${name} for their ${type.toLowerCase()} needs. Schedule your free consultation today and discover what ${adj} service really feels like.`,
    `Don't wait to achieve your goals. ${name} is ready to deliver the ${adj} ${type.toLowerCase()} experience you deserve. Contact us now and let's make it happen.`,
    `The difference between where you are and where you want to be is the right partner. ${name} is that partner. Reach out today and let's start your journey.`
  ];
  const ctaButtons = [
    'Book a Free Consultation',
    'Get in Touch Today',
    'Start Your Journey'
  ];

  /* ---------- FOOTER ---------- */
  const footerTaglines = [
    `Delivering ${adj} ${type.toLowerCase()} solutions to ${audience}${location}.`,
    `Your trusted ${type.toLowerCase()} partner${location} — proudly serving ${audience}.`,
    `${Adj} ${type.toLowerCase()} for ${audience}. Every time.`
  ];

  return {
    meta:         { title: titles[vi],          desc: metaDescs[vi] },
    hero:         { heading: heroHeadings[vi],  sub: heroSubs[vi] },
    about:        abouts[vi],
    services:     servicesSets[vi],
    whyUs:        whySets[vi],
    testimonials: testimonialSets[vi],
    faq:          faqSets[vi],
    contact:      contactIntros[vi],
    cta:          { heading: ctaHeadings[vi], body: ctaBodies[vi], btn: ctaButtons[vi] },
    footer:       { tagline: footerTaglines[vi], name }
  };
}

/* ============================================================
   RENDER VARIATIONS INTO DOM
============================================================ */
function sectionBlock(label, htmlContent, plainText) {
  const encoded = encodeURIComponent(plainText);
  return `
    <div class="section-block">
      <div class="section-label">${label}</div>
      <div class="section-content">${htmlContent}</div>
      <button class="sec-copy" data-text="${encoded}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy
      </button>
    </div>`;
}

function renderVariations(vars) {
  const container = document.getElementById('variationsContainer');
  container.innerHTML = '';

  vars.forEach((v, i) => {
    const panel = document.createElement('div');
    panel.className = `variation-panel${i === 0 ? ' active' : ''}`;
    panel.dataset.var = i;

    // Build HTML & plain text for each repeating section
    const svcHtml  = v.services.map(s => `<div style="margin-bottom:10px"><strong>${s.name}</strong><br>${s.desc}</div>`).join('');
    const svcPlain = v.services.map(s => `${s.name}:\n${s.desc}`).join('\n\n');

    const whyHtml  = v.whyUs.map(w => `<div style="margin-bottom:10px"><strong>${w.title}</strong><br>${w.desc}</div>`).join('');
    const whyPlain = v.whyUs.map(w => `${w.title}:\n${w.desc}`).join('\n\n');

    const testHtml  = v.testimonials.map(t =>
      `<div style="margin-bottom:12px;padding:10px;background:var(--card);border-radius:6px;border:1px solid var(--border)">
        <em>"${t.text}"</em><br>
        <strong style="font-size:.85rem">— ${t.name}, ${t.role}</strong>
      </div>`).join('');
    const testPlain = v.testimonials.map(t => `"${t.text}"\n— ${t.name}, ${t.role}`).join('\n\n');

    const faqHtml  = v.faq.map(f => `<div style="margin-bottom:10px"><strong>Q: ${f.q}</strong><br>A: ${f.a}</div>`).join('');
    const faqPlain = v.faq.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');

    panel.innerHTML = `
      ${sectionBlock('Page Title & Meta Description', `<strong>${v.meta.title}</strong><br><br>${v.meta.desc}`,                              `${v.meta.title}\n\n${v.meta.desc}`)}
      ${sectionBlock('Hero Section',                  `<strong>${v.hero.heading}</strong><br><br>${v.hero.sub}`,                             `${v.hero.heading}\n\n${v.hero.sub}`)}
      ${sectionBlock('About Us',                      v.about.replace(/\n/g, '<br>'),                                                        v.about)}
      ${sectionBlock('Our Services',                  svcHtml,                                                                               svcPlain)}
      ${sectionBlock('Why Choose Us',                 whyHtml,                                                                               whyPlain)}
      ${sectionBlock('Testimonials',                  testHtml,                                                                              testPlain)}
      ${sectionBlock('FAQ',                           faqHtml,                                                                               faqPlain)}
      ${sectionBlock('Contact Us',                    v.contact,                                                                             v.contact)}
      ${sectionBlock('Call to Action',                `<strong>${v.cta.heading}</strong><br><br>${v.cta.body}<br><br><strong>Button:</strong> ${v.cta.btn}`, `${v.cta.heading}\n\n${v.cta.body}\n\nButton: ${v.cta.btn}`)}
      ${sectionBlock('Footer',                        `<strong>${v.footer.name}</strong><br>${v.footer.tagline}`,                            `${v.footer.name}\n${v.footer.tagline}`)}
    `;
    container.appendChild(panel);
  });

  // Delegated click handler for all per-section copy buttons
  container.addEventListener('click', e => {
    const btn = e.target.closest('.sec-copy');
    if (!btn) return;
    clipCopy(decodeURIComponent(btn.dataset.text), btn);
  });

  updateCharInfo();
}

function updateCharInfo() {
  if (!variations.length) return;
  const len = getPlainText(variations[activeVar]).length;
  document.getElementById('charInfo').textContent = `${len.toLocaleString()} characters`;
}

/* ============================================================
   PLAIN TEXT BUILDER (used for copy all & download)
============================================================ */
function getPlainText(v) {
  const sep = '\n' + '─'.repeat(50) + '\n\n';
  return [
    `PAGE TITLE\n${v.meta.title}`,
    `META DESCRIPTION\n${v.meta.desc}`,
    `HERO HEADING\n${v.hero.heading}`,
    `HERO SUBTEXT\n${v.hero.sub}`,
    `ABOUT US\n${v.about}`,
    `OUR SERVICES\n${v.services.map(s => `• ${s.name}:\n  ${s.desc}`).join('\n\n')}`,
    `WHY CHOOSE US\n${v.whyUs.map(w => `• ${w.title}:\n  ${w.desc}`).join('\n\n')}`,
    `TESTIMONIALS\n${v.testimonials.map(t => `"${t.text}"\n— ${t.name}, ${t.role}`).join('\n\n')}`,
    `FAQ\n${v.faq.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}`,
    `CONTACT US\n${v.contact}`,
    `CALL TO ACTION\n${v.cta.heading}\n\n${v.cta.body}\n\nButton: ${v.cta.btn}`,
    `FOOTER\n${v.footer.name}\n${v.footer.tagline}`
  ].join(sep);
}

/* ============================================================
   GENERATE BUTTON
============================================================ */
document.getElementById('generateBtn').addEventListener('click', async () => {
  const type = wtInput.value.trim();
  if (!type) { showErr('Please enter a website type to continue.'); return; }

  const biz = document.getElementById('businessName').value.trim();
  const aud = document.getElementById('targetAudience').value.trim();
  const loc = document.getElementById('location').value.trim();

  // Show loading, hide output
  document.getElementById('loadingOverlay').classList.add('show');
  document.getElementById('outputCard').classList.add('output-hidden');
  document.getElementById('errorMsg').classList.remove('show');

  // Simulate async generation (replace with real API call if needed)
  await new Promise(r => setTimeout(r, 1800));

  // Build all 3 variations
  variations = [0, 1, 2].map(i => buildVariation(type, biz, aud, loc, tone, i));
  activeVar  = 0;

  // Hide loading, show output
  document.getElementById('loadingOverlay').classList.remove('show');
  document.getElementById('outputCard').classList.remove('output-hidden');

  // Reset tabs to Variation 1
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('.variation-panel').forEach(p => p.classList.toggle('active', p.dataset.var === '0'));

  renderVariations(variations);

  // Persist to history
  saveHistory({ type, biz, aud, loc, tone, date: new Date().toLocaleString() });
  renderHistory();
});

/* ============================================================
   TAB SWITCHING
============================================================ */
document.getElementById('variationTabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  activeVar = parseInt(btn.dataset.var);
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.variation-panel').forEach(p => p.classList.toggle('active', parseInt(p.dataset.var) === activeVar));
  updateCharInfo();
});

/* ============================================================
   CLIPBOARD COPY (with fallback for non-HTTPS / older browsers)
============================================================ */
function clipCopy(text, btn) {
  // Flash visual feedback on the button
  const doFlash = () => {
    if (!btn) { toast('Copied to clipboard!'); return; }
    const orig = btn.innerHTML;
    btn.classList.add('flashed');
    btn.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg> Copied!`;
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('flashed'); }, 1800);
    toast('Copied to clipboard!');
  };

  // Modern Clipboard API (requires HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(doFlash).catch(() => fallbackCopy(text, doFlash));
  } else {
    fallbackCopy(text, doFlash);
  }
}

// Textarea-based fallback copy (works everywhere)
function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    cb();
  } catch {
    toast('Copy failed — please select and copy manually.');
  }
  document.body.removeChild(ta);
}

// Copy All button
document.getElementById('copyAllBtn').addEventListener('click', () => {
  if (!variations.length) { showErr('Generate content first.'); return; }
  clipCopy(getPlainText(variations[activeVar]));
});

/* ============================================================
   DOWNLOAD TXT
============================================================ */
document.getElementById('downloadTxtBtn').addEventListener('click', () => {
  if (!variations.length) { showErr('Generate content first before downloading.'); return; }

  const divider = '\n\n' + '='.repeat(60) + '\n\n';
  const full = variations
    .map((v, i) => `VARIATION ${i + 1}\n${'='.repeat(60)}\n\n${getPlainText(v)}`)
    .join(divider);

  try {
    const blob = new Blob([full], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'website-content.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
    toast('TXT file downloaded!');
  } catch (err) {
    showErr('Download failed. Try copying the content instead.');
    console.error(err);
  }
});

/* ============================================================
   DOWNLOAD PDF (via jsPDF)
============================================================ */
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
  if (!variations.length) { showErr('Generate content first before downloading.'); return; }
  if (typeof window.jspdf === 'undefined') {
    showErr('PDF library not loaded. Please refresh the page and try again.');
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });

    const PW = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const ML = 48, MR = 48, MT = 56, MB = 48;
    const TW = PW - ML - MR;

    // Add a new page and return starting Y
    function addPage() { doc.addPage(); return MT; }

    // Check remaining space; add page if needed
    function checkY(y, needed) { return (y + needed > PH - MB) ? addPage() : y; }

    // Write a block of text with auto word-wrap and paging
    function writeLine(text, y, opts = {}) {
      const { size = 10, style = 'normal', color = [30, 41, 59], indent = 0 } = opts;
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, TW - indent);
      y = checkY(y, lines.length * (size * 1.45));
      doc.text(lines, ML + indent, y);
      return y + lines.length * (size * 1.45) + 4;
    }

    // Colored section header bar
    function writeSection(title, y) {
      y = checkY(y, 36);
      doc.setFillColor(99, 102, 241);
      doc.roundedRect(ML, y, TW, 22, 3, 3, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), ML + 10, y + 14.5);
      return y + 30;
    }

    // Render all 3 variations
    variations.forEach((v, vi) => {
      let y = vi === 0 ? MT : addPage();

      // Page header banner
      doc.setFillColor(239, 242, 255);
      doc.rect(0, 0, PW, 36, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(`${v.footer.name}  |  Website Content  |  Variation ${vi + 1} of 3`, ML, 22);
      y = 56;

      // Variation title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      const tLines = doc.splitTextToSize(`Variation ${vi + 1}: ${v.meta.title}`, TW);
      doc.text(tLines, ML, y);
      y += tLines.length * 24 + 12;

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(ML, y, PW - MR, y);
      y += 12;

      // META
      y = writeSection('Meta Description', y);
      y = writeLine(v.meta.desc, y, { size: 10 }); y += 4;

      // HERO
      y = writeSection('Hero Section', y);
      y = writeLine(v.hero.heading, y, { size: 12, style: 'bold', color: [79, 70, 229] }); y += 2;
      y = writeLine(v.hero.sub, y, { size: 10 }); y += 4;

      // ABOUT
      y = writeSection('About Us', y);
      v.about.split('\n\n').forEach(para => { y = writeLine(para, y, { size: 10 }); y += 4; });

      // SERVICES
      y = writeSection('Our Services', y);
      v.services.forEach(s => {
        y = writeLine(`• ${s.name}`, y, { size: 10, style: 'bold', color: [79, 70, 229] });
        y = writeLine(s.desc, y, { size: 10, indent: 12 }); y += 4;
      });

      // WHY CHOOSE US
      y = writeSection('Why Choose Us', y);
      v.whyUs.forEach(w => {
        y = writeLine(`• ${w.title}`, y, { size: 10, style: 'bold', color: [79, 70, 229] });
        y = writeLine(w.desc, y, { size: 10, indent: 12 }); y += 4;
      });

      // TESTIMONIALS
      y = writeSection('Testimonials', y);
      v.testimonials.forEach(t => {
        y = writeLine(`"${t.text}"`, y, { size: 10, style: 'italic', color: [71, 85, 105] });
        y = writeLine(`— ${t.name}, ${t.role}`, y, { size: 9, style: 'bold', indent: 12 }); y += 6;
      });

      // FAQ
      y = writeSection('FAQ', y);
      v.faq.forEach(f => {
        y = writeLine(`Q: ${f.q}`, y, { size: 10, style: 'bold', color: [30, 41, 59] });
        y = writeLine(`A: ${f.a}`, y, { size: 10, indent: 12 }); y += 6;
      });

      // CONTACT
      y = writeSection('Contact Us', y);
      y = writeLine(v.contact, y, { size: 10 }); y += 4;

      // CALL TO ACTION
      y = writeSection('Call to Action', y);
      y = writeLine(v.cta.heading, y, { size: 12, style: 'bold', color: [79, 70, 229] }); y += 2;
      y = writeLine(v.cta.body, y, { size: 10 }); y += 4;
      y = writeLine(`Button: ${v.cta.btn}`, y, { size: 10, style: 'bold' }); y += 4;

      // FOOTER
      y = writeSection('Footer', y);
      y = writeLine(v.footer.name, y, { size: 11, style: 'bold' });
      y = writeLine(v.footer.tagline, y, { size: 10 });

      // Page footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Generated by AI Website Content Generator  |  Variation ${vi + 1}`,
        ML, PH - 18
      );
    });

    doc.save('website-content.pdf');
    toast('PDF downloaded!');

  } catch (err) {
    showErr('PDF generation failed. Please try the TXT download instead.');
    console.error(err);
  }
});

/* ============================================================
   RESET BUTTON
============================================================ */
document.getElementById('resetBtn').addEventListener('click', () => {
  ['websiteType', 'businessName', 'targetAudience', 'location'].forEach(id => {
    document.getElementById(id).value = '';
  });
  typeCount.textContent = '0';

  // Reset tone to default
  tone = 'Professional';
  document.querySelectorAll('.tone-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tone === 'Professional');
  });

  // Hide output & loading
  document.getElementById('outputCard').classList.add('output-hidden');
  document.getElementById('loadingOverlay').classList.remove('show');
  document.getElementById('errorMsg').classList.remove('show');

  variations = [];
  toast('All fields cleared.');
});

/* ============================================================
   HISTORY — load / save / render
============================================================ */
function loadHistory() {
  try { return JSON.parse(localStorage.getItem('acg_history') || '[]'); }
  catch { return []; }
}

function saveHistory(entry) {
  const h = loadHistory();
  h.unshift(entry);
  localStorage.setItem('acg_history', JSON.stringify(h.slice(0, MAX_HISTORY)));
}

function renderHistory() {
  const h  = loadHistory();
  const el = document.getElementById('historyList');

  if (!h.length) {
    el.innerHTML = '<div class="no-history">No generations yet. Start creating!</div>';
    return;
  }

  el.innerHTML = h.map((item, i) => `
    <div class="history-item">
      <div>
        <div style="font-weight:700">${item.biz ? item.biz + ' — ' : ''}${item.type}</div>
        <div class="history-meta">${item.tone}${item.loc ? ' · ' + item.loc : ''} · ${item.date}</div>
      </div>
      <button class="history-reload" data-i="${i}">Reload</button>
    </div>`).join('');

  // Reload a history entry into the form
  el.querySelectorAll('.history-reload').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = h[parseInt(btn.dataset.i)];
      document.getElementById('websiteType').value    = item.type || '';
      typeCount.textContent                            = (item.type || '').length;
      document.getElementById('businessName').value   = item.biz  || '';
      document.getElementById('targetAudience').value = item.aud  || '';
      document.getElementById('location').value       = item.loc  || '';
      tone = item.tone || 'Professional';
      document.querySelectorAll('.tone-btn').forEach(b => b.classList.toggle('active', b.dataset.tone === tone));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('History entry loaded!');
    });
  });
}

// Clear history
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  localStorage.removeItem('acg_history');
  renderHistory();
  toast('History cleared.');
});

// Initialize history on page load
renderHistory();
