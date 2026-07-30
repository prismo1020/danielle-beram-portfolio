(() => {
  const host = document.querySelector("#site-navigation");
  if (!host) return;

  const page = location.pathname.split("/").pop() || "index.html";
  const items = [
    { group: "Start", label: "Start Here", href: "index.html" },
    { group: "Start", label: "About Danielle", href: "about.html" },
    { group: "Case studies", label: "Onboarding System", href: "onboarding.html" },
    { group: "Case studies", label: "Global eLearning", href: "elearning.html" },
    { group: "Case studies", label: "New Store Opening Portal", href: "nso.html" },
    { group: "Case studies", label: "Apollo AI", href: "apollo.html" },
    { group: "Case studies", label: "Training Redesign", href: "training.html" },
    { group: "Recruiter", label: "Résumé & Contact", href: "contact.html" }
  ];

  const nav = (mobile = false) => {
    let currentGroup = "";
    return items.map((item) => {
      const group = item.group !== currentGroup
        ? `<span class="sidebar-label">${item.group}</span>`
        : "";
      currentGroup = item.group;
      const active = item.href === page;
      return `${group}<a href="${item.href}"${active ? ' aria-current="page"' : ""}>${item.label}</a>`;
    }).join("");
  };

  host.innerHTML = `
    <aside class="portfolio-sidebar" aria-label="Portfolio navigation">
      <a class="sidebar-brand" href="index.html" aria-label="Danielle Beram, start page">
        <span class="sidebar-monogram" aria-hidden="true">DB</span>
        <span><strong>Danielle Beram</strong><small>Global L&D leader</small></span>
      </a>
      <p class="sidebar-positioning">Global onboarding, new-store training, eLearning production, and AI knowledge support.</p>
      <nav class="sidebar-nav" aria-label="Primary navigation">${nav()}</nav>
      <div class="sidebar-recruiter">
        <span>Open to relocation</span>
        <strong>Global learning, operations, and AI enablement</strong>
        <a href="contact.html">Résumé & contact →</a>
      </div>
      <div class="sidebar-actions">
        <a class="sidebar-resume" href="assets/downloads/Danielle Beram Resume.pdf" download>Download résumé</a>
        <a href="https://linkedin.com/in/danielle-beram" target="_blank" rel="noopener">LinkedIn ↗</a>
      </div>
    </aside>
    <header class="mobile-header">
      <a class="mobile-brand" href="index.html"><span class="sidebar-monogram" aria-hidden="true">DB</span><strong>Danielle Beram</strong></a>
      <details class="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">${nav(true)}</nav>
      </details>
    </header>
  `;
})();
