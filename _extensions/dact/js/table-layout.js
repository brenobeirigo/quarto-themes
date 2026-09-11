(() => {
  const selector = [
    "main.content .quarto-float-tbl > div[aria-describedby]",
    "main.content .table-responsive",
    "main.content .cell-output-display:has(table.table)",
    "main.content div[id^='dact-decision-']:has(> table.gt_table)"
  ].join(",");

  const tableName = (region) => {
    const descriptionId = region.getAttribute("aria-describedby");
    const caption = descriptionId
      ? document.getElementById(descriptionId)
      : region.closest("figure")?.querySelector("figcaption");
    const text = caption?.textContent?.replace(/\s+/g, " ").trim();
    return text || "table";
  };

  const upgradeDecisionTables = () => {
    document.querySelectorAll("main.content div[id^='dact-decision-']:has(> table.gt_table)").forEach((region) => {
      const caption = region.closest("figure")?.querySelector("figcaption");
      const table = region.querySelector("table.gt_table");
      if (!table) return;

      if (caption?.id) {
        region.setAttribute("aria-describedby", caption.id);
        table.setAttribute("aria-describedby", caption.id);
      }
      table.querySelectorAll("thead th.gt_col_heading").forEach((cell) => {
        if (!cell.hasAttribute("scope")) cell.setAttribute("scope", "col");
      });
      table.querySelectorAll("thead th.gt_column_spanner_outer").forEach((cell) => {
        cell.setAttribute("scope", "colgroup");
      });
      table.querySelectorAll("tbody th.gt_stub").forEach((cell) => {
        cell.setAttribute("scope", "row");
      });
      table.querySelectorAll("tbody th.gt_group_heading").forEach((cell) => {
        cell.setAttribute("scope", "rowgroup");
      });
    });
  };

  const upgradeRowHeaders = () => {
    document.querySelectorAll("main.content table.row-headers tbody tr").forEach((row) => {
      const cell = row.firstElementChild;
      if (!cell || cell.tagName === "TH") return;

      const header = document.createElement("th");
      for (const attribute of cell.attributes) {
        header.setAttribute(attribute.name, attribute.value);
      }
      header.setAttribute("scope", "row");
      while (cell.firstChild) header.appendChild(cell.firstChild);
      cell.replaceWith(header);
    });
  };

  const updateTableRegions = () => {
    upgradeRowHeaders();
    upgradeDecisionTables();
    // Uncaptioned Markdown tables need the same scroll container as captioned tables.
    document.querySelectorAll("main.content table.table").forEach((table) => {
      if (table.closest(selector) || table.closest(".gt_table, .form-table, .handwritten-table, .decision-table, [id^='dact-decision-']")) return;
      const region = document.createElement("div");
      region.className = "table-responsive";
      table.before(region);
      region.appendChild(table);
    });
    document.querySelectorAll(selector).forEach((region) => {
      const isScrollable = region.scrollWidth > region.clientWidth + 2;
      let hint = region.querySelector(":scope > .table-scroll-hint");

      if (isScrollable) {
        region.classList.add("table-scroll-region");
        region.setAttribute("tabindex", "0");
        region.setAttribute("role", "region");
        region.setAttribute("aria-label", `Scrollable ${tableName(region)}`);
        region.dataset.dactTableScroll = "true";

        if (!hint) {
          hint = document.createElement("div");
          hint.className = "table-scroll-hint";
          hint.setAttribute("aria-hidden", "true");
          hint.textContent = "Scroll horizontally to read all columns →";
          region.prepend(hint);
        }
      } else if (region.dataset.dactTableScroll === "true") {
        region.classList.remove("table-scroll-region");
        region.removeAttribute("tabindex");
        region.removeAttribute("role");
        region.removeAttribute("aria-label");
        delete region.dataset.dactTableScroll;
        hint?.remove();
      }
    });
  };

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateTableRegions, 120);
  });
  document.addEventListener("shown.bs.collapse", updateTableRegions);
  document.addEventListener("shown.bs.tab", updateTableRegions);
  window.addEventListener("load", updateTableRegions);
  window.requestAnimationFrame(updateTableRegions);
})();
