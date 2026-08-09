import fs from 'fs';
import path from 'path';

const outCat = 'public/categories';
const outJournal = 'public/journal';

const shell = ({ title, breadcrumbLabel, heroLabel, heading, meta, cover, coverAlt, body, extLink, extLabel, related, relBase }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Terrain Tapestry</title>
<link rel="icon" href="data:,">
<link rel="stylesheet" href="../styles.css">
</head>
<body>
<div class="preloader" id="preloader"><span class="preloader-mark">Terrain Tapestry</span></div>
<div class="scroll-progress" id="scrollProgress"></div>

<header class="site-header" id="siteHeader">
  <div class="wrap">
    <a href="../index.html" class="brand">
      Terrain Tapestry
      <small>Landscape &amp; the Built Environment</small>
    </a>
    <nav class="nav" id="siteNav">
      <a href="../index.html#layers">Layers</a>
      <a href="../index.html#categories">Categories</a>
      <a href="../index.html#blog">Journal</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#contact">Contact</a>
    </nav>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<main>
  <section class="detail-hero">
    <div class="wrap reveal visible">
      <p class="breadcrumb"><a href="../index.html">Terrain Tapestry</a> / <span>${breadcrumbLabel}</span></p>
      <span class="section-label">${heroLabel}</span>
      <h1>${heading}</h1>
      <p class="detail-meta">${meta}</p>
    </div>
  </section>
  ${cover ? `<div class="detail-cover-wrap"><img class="detail-cover" src="${cover}" alt="${coverAlt}" loading="lazy"></div>` : ''}
  <section class="detail-body">
    <div class="wrap reveal">
      ${body}
      <div class="detail-cta">
        <a class="btn-outline" href="${extLink}" target="_blank" rel="noopener">${extLabel} ↗</a>
        <a class="btn-outline" href="../index.html">← Back to Terrain Tapestry</a>
      </div>
      ${related}
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="wrap">
    <span class="brand-mark">Terrain Tapestry</span>
    <small>© <span id="year"></span> Resham Mehta. All field notes reserved.</small>
  </div>
</footer>

<button class="to-top" id="toTop" aria-label="Back to top">↑</button>

<script src="../script.js"></script>
</body>
</html>
`;

const categories = [
  {
    slug: 'engineering-in-landscape', code: 'PLATE 01 — STRUCTURE', title: "Engineering in Landscape",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/07/oval-fountains.jpg?w=1200',
    body: `
      <p class="lede">Are landscapes engineered? Natural terrain forms organically; built landscapes are shaped
      by intention. This category argues that because both are ultimately governed by scientific principles, the
      built and the natural sit on the same engineered continuum.</p>
      <p>Through case studies and personal field observations, this thread examines the intersection of nature,
      human interaction and the built environment — grading, drainage, structural planting, hydraulic systems
      and the quieter engineering decisions that hold a landscape together long after the design drawings are
      filed away.</p>
      <p>It's a category for readers who want to see landscape architecture as applied science as much as art:
      the load paths beneath a lawn, the slope calculations behind a "natural" stream, the reasons a garden
      drains the way it does.</p>`,
    ext: 'https://mehtareshamc.in/page-engineering-in-landscape/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'dissolution-of-mumbai-harbour', code: 'PLATE 02 — HYDROLOGY', title: "Dissolution of Mumbai Harbour",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/11/mumbai-map.jpg?w=1200',
    body: `
      <p class="lede">A satellite image of Mumbai Harbour, viewed on Google Earth, should show a funnel of blue
      water separating the island city from the mainland. Instead, the water reads as absence — a harbour
      visibly silting in front of a growing metropolis.</p>
      <p>That observation set off a research series examining the causes accelerating siltation in the harbour:
      declining water quality, loss of marine biodiversity, and rising flood risk, all read against a century of
      port expansion and coastal urban intervention.</p>
      <p>The series is structured chronologically — including a dedicated study of the 1914–1947 period, when
      infrastructure like the Alexandra and Mazagaon Docks reshaped the harbour to accommodate deeper-draught
      shipping — building toward a picture of how sustainable coastal management could still intervene.</p>`,
    ext: 'https://mehtareshamc.in/page-the-dissolution-of-mumbai-harbour/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'dreams-on-fault-lines', code: 'PLATE 03 — SEISMICITY', title: "Dreams on Fault Lines",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/11/cover-page_dreams-on-faultline.jpg?w=1200',
    body: `
      <p class="lede">Headlines about tremors felt across Palghar and Mumbai's eastern suburbs, and an IIT-Bombay
      study on seismic vulnerability, prompted a deeper question: how prepared is a city like Mumbai, really?</p>
      <p>This category digs into the history of seismic activity in the region, its geological conditions, and
      the current hydro-geological scenario — the layered factors that could contribute to moderate-to-severe
      damage in a future event.</p>
      <p>Beyond diagnosis, the series works toward planning strategies that could mitigate seismic impact,
      developing a methodology intended to be portable to other cities navigating the same risk.</p>`,
    ext: 'https://mehtareshamc.in/dreams-on-faultline/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'adaptive-reuse-mumbai-portlands', code: 'PLATE 04 — REGENERATION', title: "Adaptive Re-use of Mumbai's Under-utilised Portlands",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/11/cover-page_adaptive-re-use-of-mumbais-under-utilised-prtlands.jpg?w=1200',
    body: `
      <p class="lede">Mumbai's port activity helped lift a scattered archipelago of agrarian islands into a
      global metropolis. Over time, that same relationship reversed — port areas fell into under-use, and
      eventually abandonment, as the city's economic centre of gravity shifted elsewhere.</p>
      <p>Taking cues from Ian McHarg's <em>Design with Nature</em>, this category proposes a framework for
      adaptive reuse of Mumbai's portlands — one that responds to their unique environmental setting, the needs
      of the wider region, and the port's cultural and landscape identity, without erasing its historical and
      ecological essence.</p>`,
    ext: 'https://mehtareshamc.in/adaptive-re-use-of-mumbais-under-utilized-portlands/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'waterfronts', code: 'PLATE 05 — EDGE CONDITIONS', title: "Waterfronts",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/11/cover-page_waterfronts.jpg?w=1200',
    body: `
      <p class="lede">Wherever land meets water — estuarine, coastal, riverfront or lakefront — civilisation
      tends to follow. The Euphrates, the Nile, the Indus: waterfronts have been the cradle of settlement and
      trade since agriculture began.</p>
      <p>As maritime commerce grew, urban centres shifted from riverbanks to seafronts, and that growth has
      often come at real environmental cost. This category surveys both sides of that history: cities that have
      embraced green infrastructure and ecological restoration along their edges, and the untouched natural
      waterfronts that still serve as reference points for conservation-minded design.</p>`,
    ext: 'https://mehtareshamc.in/blog-waterfronts/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'whats-in-a-name', code: 'PLATE 06 — TOPONYMY', title: "What's in a Name…",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/11/cover-page_whats-in-a-name-1.jpg?w=1200',
    body: `
      <p class="lede">Indigenous place names, where they haven't been erased by colonial rule, quietly encode
      landscape qualities and the way people once related to the land beneath them.</p>
      <p>Taking its cue from Tim Waterman's writing on climate futures embedded in ancient place names, this
      series decodes the landscape identity of Mumbai through its own place names — many of which date to the
      earliest known period of inhabitation, roughly 700–1000 A.D., an era whose extreme weather and
      precipitation patterns bear an uncomfortable resemblance to our own.</p>
      <p>Read that way, the city's oldest names become less nostalgic and more instructive — a set of
      indigenous clues to how Mumbai might respond to the climate ahead.</p>`,
    ext: 'https://mehtareshamc.in/whats-in-a-name/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'bird-friendly-landscapes', code: 'PLATE 07 — AVIFAUNA', title: "Bird-friendly Landscapes",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/04/cover-page-3.jpg?w=1200',
    body: `
      <p class="lede">Urban expansion and habitat loss are usually treated as a package deal. This category
      asks whether that has to be true — and studies cities that have grown while keeping bird habitats intact.</p>
      <p>It probes the threats driving the rapid decline of bird species, and questions the methodologies of
      urbanisation itself: can cities be designed in synchronisation with habitat development, and can lessons
      from bird-friendly cities elsewhere translate into an Indian context?</p>
      <p>The series works through detailed habitat studies and literature review toward practical design
      guidance — spaces sensitive to avifauna, built by a human society willing to share ground.</p>`,
    ext: 'https://mehtareshamc.in/bird-friendly-landscapes/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'playscapes', code: 'PLATE 08 — PEDAGOGY', title: "Playscapes",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/04/playscape_coverpage-alt-02.jpg?w=1200',
    body: `
      <p class="lede">Free play — unstructured, voluntary, child-initiated — is where imagination gets exercised.
      This category looks at it from a landscape architect's vantage point: as a design problem, not just a
      developmental one.</p>
      <p>It traces a shift in how designers approach environments for children — from installing play equipment
      to designing playscapes that invite children to interpret, define and re-interpret space on their own
      terms — and asks what standards should guide that shift.</p>
      <p>The series closes by proposing standards for designing playscapes, grounded in neuroscience research
      and the physical and behavioural development of children across different ages.</p>`,
    ext: 'https://mehtareshamc.in/playscapes/', extLabel: 'Read full articles on the journal',
  },
  {
    slug: 'resources', code: 'PLATE 09 — REFERENCE', title: "Resources",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2024/04/cover-page_resources.jpg',
    body: `
      <p class="lede">This category exists because of a question a student couldn't easily answer. While
      teaching as visiting faculty for the Allied Design Studio–Landscape at Sir J.J. College of Architecture,
      Mumbai, a field study of plants prompted a student to ask for references to better understand landscape
      architecture as a field.</p>
      <p>That question surfaced a gap: post-graduate study in landscape architecture opens up a wealth of
      resources that undergraduates rarely know exist. Resources is a direct response — a running collection of
      books, podcasts, series, courses, magazines and journals that have shaped this practice, shared for
      students who don't yet know what they're missing.</p>`,
    ext: 'https://mehtareshamc.in/page-resources/', extLabel: 'Read full articles on the journal',
  },
];

const journal = [
  {
    slug: 'go-observe-the-bus-stop', code: '13 AUG 2025', title: "Go, observe the 'Bus Stop'!",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2025/08/bus-stop-shimla.jpg?w=1200',
    body: `
      <p class="lede">We tend to talk about architecture in terms of the monumental — museums, skyscrapers, the
      urban parks that make it into magazines. This entry asks whether the truest read on a city instead lives
      in its most ordinary spaces.</p>
      <p>What if understanding urban life began not with landmark buildings, but with something as unremarkable
      as a bus stop — where it's placed, how it's used, what it reveals about the people who pass through it
      every day?</p>
      <p>The full piece retraces that idea through an observed bus stop in Shimla, using it as a small,
      concrete lens on much larger questions about public infrastructure and everyday urban life. The complete
      article, with the writer's full observations, is on the original journal.</p>`,
    ext: 'https://mehtareshamc.wordpress.com/2025/08/13/go-observe-the-bus-stop/', extLabel: 'Read the full entry',
  },
  {
    slug: 'indian-plantarum', code: '31 MAY 2025', title: "Indian Plantarum: A Guide to India's Phytogeographic Zones and Plant Species",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2025/05/cover-page_26.jpg?w=1200',
    body: `
      <p class="lede">A review of what the piece calls a pioneering contribution to Indian ecological
      literature — a compendium of the country's phytogeographic zones and accompanying plant lists.</p>
      <p>The book is framed as both a foundational reference and a practical tool: useful for anyone working to
      understand, preserve, or plan with India's varied flora, and positioned as a base for further research in
      the field.</p>
      <p>The full review discusses the book's structure and utility in more depth, and is available on the
      original journal.</p>`,
    ext: 'https://mehtareshamc.wordpress.com/2025/05/31/indian-plantarum-a-guide-to-indias-phytogeographic-zones-and-plant-species/', extLabel: 'Read the full entry',
  },
  {
    slug: 'dissolution-mumbai-harbour-1914-1947', code: '26 MAY 2025', title: "The Dissolution of Mumbai Harbour: 1914–1947",
    cover: 'https://mehtareshamc.wordpress.com/wp-content/uploads/2025/05/cover-page_25.jpg?w=1200',
    body: `
      <p class="lede">Part of the ongoing Dissolution of Mumbai Harbour series, this entry looks specifically at
      the 1914–1947 window — a period of port expansion driven by advances in shipping technology that demanded
      deeper draughts for larger vessels.</p>
      <p>That demand drove the construction of major infrastructure, including the Hughes Dry Dock, Alexandra
      Dock and Mazagaon Dock — with the Alexandra Dock standing out for how modern it was for its time.</p>
      <p>The full article traces how this first phase of expansion set the harbour on its long path toward the
      siltation visible today, and is available on the original journal.</p>`,
    ext: 'https://mehtareshamc.wordpress.com/2025/05/26/the-dissolution-of-mumbai-harbour-influence-of-anthropogenic-activities-c-1914-to-1947-a-d/', extLabel: 'Read the full entry',
  },
];

fs.mkdirSync(outCat, { recursive: true });
fs.mkdirSync(outJournal, { recursive: true });

for (const c of categories) {
  const html = shell({
    title: c.title,
    breadcrumbLabel: 'Categories',
    heroLabel: c.code,
    heading: c.title,
    meta: 'Category · Terrain Tapestry',
    cover: c.cover,
    coverAlt: c.title,
    body: c.body,
    extLink: c.ext,
    extLabel: c.extLabel,
    related: '',
  });
  fs.writeFileSync(path.join(outCat, `${c.slug}.html`), html);
}

for (const j of journal) {
  const html = shell({
    title: j.title,
    breadcrumbLabel: 'Journal',
    heroLabel: j.code,
    heading: j.title,
    meta: 'Journal entry · by Resham Mehta',
    cover: j.cover,
    coverAlt: j.title,
    body: j.body,
    extLink: j.ext,
    extLabel: j.extLabel,
    related: '',
  });
  fs.writeFileSync(path.join(outJournal, `${j.slug}.html`), html);
}

console.log(`Generated ${categories.length} category pages and ${journal.length} journal pages.`);
