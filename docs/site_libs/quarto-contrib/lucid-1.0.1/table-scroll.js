// Lucid table scroll regions.
//
// A table wider than the reading column becomes a focusable, labelled scroll
// region with a visible hint on small screens, so keyboard and screen-reader
// users can reach every column. Great Tables output also gains the header
// scope attributes it does not write itself.

(() => {
  const regionSelector = [
    "main.content .quarto-float-tbl > div[aria-describedby]",
    "main.content .table-responsive",
    "main.content .cell-output-display:has(table.table)",
    "main.content div:has(> table.gt_table)",
  ].join(",");

  const componentTables = ".gt_table, .form-table, .handwritten-table, .decision-table";

  const tableName = (region) => {
    const descriptionId = region.getAttribute("aria-describedby");
    const caption = descriptionId
      ? document.getElementById(descriptionId)
      : region.closest("figure")?.querySelector("figcaption");
    const text = caption?.textContent?.replace(/\s+/g, " ").trim();
    return text || "table";
  };

  const upgradeGreatTables = () => {
    document.querySelectorAll("main.content div:has(> table.gt_table)").forEach((region) => {
      const table = region.querySelector(":scope > table.gt_table");
      const caption = region.closest("figure")?.querySelector("figcaption");

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

  // Fallback for .row-headers tables that reach the page without <th> cells.
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

  const wrapBareTables = () => {
    document.querySelectorAll("main.content table.table").forEach((table) => {
      if (table.closest(regionSelector) || table.closest(componentTables)) return;
      const region = document.createElement("div");
      region.className = "table-responsive";
      table.before(region);
      region.appendChild(table);
    });
  };

  const updateRegions = () => {
    upgradeRowHeaders();
    upgradeGreatTables();
    wrapBareTables();

    document.querySelectorAll(regionSelector).forEach((region) => {
      const scrollable = region.scrollWidth > region.clientWidth + 2;
      let hint = region.querySelector(":scope > .table-scroll-hint");

      if (scrollable) {
        region.classList.add("table-scroll-region");
        region.setAttribute("tabindex", "0");
        region.setAttribute("role", "region");
        region.setAttribute("aria-label", `Scrollable ${tableName(region)}`);
        region.dataset.lucidScroll = "true";

        if (!hint) {
          hint = document.createElement("div");
          hint.className = "table-scroll-hint";
          hint.setAttribute("aria-hidden", "true");
          hint.textContent = "Scroll horizontally to read all columns →";
          region.prepend(hint);
        }
      } else if (region.dataset.lucidScroll === "true") {
        region.classList.remove("table-scroll-region");
        region.removeAttribute("tabindex");
        region.removeAttribute("role");
        region.removeAttribute("aria-label");
        delete region.dataset.lucidScroll;
        hint?.remove();
      }
    });
  };

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateRegions, 120);
  });
  document.addEventListener("shown.bs.collapse", updateRegions);
  document.addEventListener("shown.bs.tab", updateRegions);
  window.addEventListener("load", updateRegions);
  window.requestAnimationFrame(updateRegions);
})();
