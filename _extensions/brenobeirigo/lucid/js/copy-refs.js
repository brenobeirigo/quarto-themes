// Lucid copy-reference buttons.
//
// A numbered label inside a heading gets a small button. Pressing it copies
// "<identifier> — <heading text>" followed by a link to that heading, which is
// a convenient way for readers to cite an exercise in a question or a report.

document.addEventListener("DOMContentLoaded", () => {
  const labelSelector = [
    "[data-copy-ref]",
    "[data-page-id]",
    "[data-section-id]",
    ".question-group-label",
    ".exercise-label",
  ].join(", ");

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  const headingText = (heading) => {
    const clone = heading.cloneNode(true);
    clone
      .querySelectorAll(`${labelSelector}, .copy-ref-button, .anchorjs-link`)
      .forEach((element) => element.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
  };

  const setIcon = (button, icon) => {
    const glyph = document.createElement("i");
    glyph.className = `bi ${icon}`;
    glyph.setAttribute("aria-hidden", "true");
    button.replaceChildren(glyph);
  };

  document.querySelectorAll(`main :is(${labelSelector})`).forEach((label) => {
    const heading = label.closest("h1, h2, h3, h4, h5, h6");
    if (!heading || heading.querySelector(":scope > .copy-ref-button")) return;

    const identifier =
      label.dataset.copyRef ||
      label.dataset.pageId ||
      label.dataset.sectionId ||
      label.dataset.questionGroupId ||
      label.dataset.exerciseId ||
      label.textContent.trim();

    const idleLabel = `Copy reference ${identifier}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-ref-button";
    button.title = idleLabel;
    button.setAttribute("aria-label", idleLabel);
    setIcon(button, "bi-clipboard");

    button.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      if (heading.id) url.hash = heading.id;

      try {
        await copyText(`${identifier} — ${headingText(heading)}\n${url}`);
        button.classList.add("copied");
        button.setAttribute("aria-label", `Copied reference ${identifier}`);
        setIcon(button, "bi-check2");
        window.setTimeout(() => {
          button.classList.remove("copied");
          button.setAttribute("aria-label", idleLabel);
          setIcon(button, "bi-clipboard");
        }, 1600);
      } catch (error) {
        console.warn("Lucid: could not copy the reference", error);
      }
    });

    heading.appendChild(button);
  });
});
