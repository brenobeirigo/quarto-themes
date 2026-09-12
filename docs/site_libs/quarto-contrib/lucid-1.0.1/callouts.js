// Lucid callouts: keyboard-operable collapsible callouts, and "Solution to <exercise>" titles.

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll('.callout-header[data-bs-toggle="collapse"]')
    .forEach((toggle) => {
      toggle.setAttribute("role", "button");
      toggle.setAttribute("tabindex", "0");
      toggle.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle.click();
      });
    });

  document
    .querySelectorAll('.callout[title^="Solution [-@"]')
    .forEach((callout) => {
      const title = callout.querySelector(".callout-title-container");
      if (title === null) return;

      const screenReaderLabel = title.querySelector(".screen-reader-only");
      const crossReference = title.querySelector(".quarto-xref");
      const targetHref = crossReference?.getAttribute("href");
      let exerciseId = null;

      if (targetHref?.startsWith("#")) {
        const target = document.querySelector(targetHref);
        exerciseId =
          target?.dataset.exerciseId ||
          target?.querySelector(".exercise-label")?.dataset.exerciseId ||
          target?.querySelector(".exercise-label")?.textContent.trim();
      }

      title.replaceChildren();
      if (screenReaderLabel !== null) title.append(screenReaderLabel);

      const visibleTitle = exerciseId ? `Solution to ${exerciseId}` : "Solution";
      title.append(document.createTextNode(visibleTitle));
      callout.setAttribute("title", visibleTitle);
    });
});
