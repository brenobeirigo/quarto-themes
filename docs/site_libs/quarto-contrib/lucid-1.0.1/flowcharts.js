// Lucid flowcharts: natural-size Mermaid diagrams with an accessible SVG title and description.

(() => {
  const temporarilyRevealedCallouts = [];

  document.querySelectorAll(".callout-collapse:has(pre.mermaid)").forEach((collapse) => {
    if (collapse.classList.contains("show")) {
      return;
    }

    const header = collapse.closest(".callout")?.querySelector(".callout-header");
    collapse.classList.add("show");
    header?.classList.remove("collapsed");
    header?.setAttribute("aria-expanded", "true");
    temporarilyRevealedCallouts.push({ collapse, header });
  });

  const restoreCollapsedCallouts = () => {
    temporarilyRevealedCallouts.forEach(({ collapse, header }) => {
      collapse.classList.remove("show");
      header?.classList.add("collapsed");
      header?.setAttribute("aria-expanded", "false");
    });
  };

  const enhanceFlowchart = (flowchart) => {
    if (flowchart.dataset.flowchartEnhanced === "true") {
      return;
    }

    const viewBox = flowchart
      .getAttribute("viewBox")
      .trim()
      .split(/\s+/)
      .map(Number);
    const width = viewBox[2];
    const height = viewBox[3];

    if (!(width > 0 && height > 0)) {
      return;
    }

    flowchart.dataset.flowchartEnhanced = "true";
    flowchart.classList.add("flowchart");
    flowchart.style.setProperty("--flowchart-intrinsic-width", `${width}px`);
    flowchart.style.setProperty("--flowchart-intrinsic-height", `${height}px`);
    flowchart.removeAttribute("width");
    flowchart.removeAttribute("height");
    flowchart.setAttribute("preserveAspectRatio", "xMidYMin meet");

    const namespace = "http://www.w3.org/2000/svg";
    const caption = flowchart
      .closest(".quarto-float")
      ?.querySelector("figcaption")
      ?.textContent
      ?.replace(/\s+/g, " ")
      ?.trim();
    const diagramId = flowchart.id || `flowchart-${Math.random().toString(36).slice(2)}`;
    flowchart.id = diagramId;

    let title = flowchart.querySelector(":scope > title");
    if (title === null) {
      title = document.createElementNS(namespace, "title");
      title.textContent = caption || "Flowchart";
      flowchart.prepend(title);
    }
    title.id = title.id || `${diagramId}-title`;

    let description = flowchart.querySelector(":scope > desc");
    if (description === null) {
      description = document.createElementNS(namespace, "desc");
      flowchart.insertBefore(description, title.nextSibling);
    }
    if (description.textContent.trim() === "") {
      description.textContent = caption
        ? `Diagram corresponding to ${caption}.`
        : "Flowchart showing the steps, decisions, and paths described in the surrounding text.";
    }
    description.id = description.id || `${diagramId}-description`;
    flowchart.setAttribute("aria-labelledby", `${title.id} ${description.id}`);

    const container = flowchart.parentElement;
    if (container !== null) {
      container.classList.add("flowchart-viewport");
    }
  };

  const enhanceAllFlowcharts = () => {
    document
      .querySelectorAll("svg.flowchart[viewBox], pre.mermaid svg[viewBox]")
      .forEach(enhanceFlowchart);
  };

  const waitForMermaid = (attempt = 0) => {
    const pendingDiagram = [...document.querySelectorAll("pre.mermaid")]
      .some((diagram) => diagram.querySelector("svg") === null);

    if (pendingDiagram && attempt < 80) {
      window.setTimeout(() => waitForMermaid(attempt + 1), 250);
      return;
    }

    enhanceAllFlowcharts();
    restoreCollapsedCallouts();
  };

  window.addEventListener("load", () => waitForMermaid(), { once: true });
  document.addEventListener("shown.bs.collapse", enhanceAllFlowcharts);
})();
