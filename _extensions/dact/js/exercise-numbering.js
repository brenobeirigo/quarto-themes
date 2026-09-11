document.addEventListener("DOMContentLoaded", () => {
  const selector = [
    "main .dact-page-number",
    "main .dact-section-number",
    "main .question-group-label",
    "main .exercise-label",
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

  const headingTextWithoutControls = (heading) => {
    const clone = heading.cloneNode(true);
    clone
      .querySelectorAll(
        ".dact-page-number, .dact-section-number, .question-group-label, .exercise-label, .dact-copy-reference"
      )
      .forEach((element) => element.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
  };

  document.querySelectorAll(selector).forEach((label) => {
    const heading = label.closest("h1, h2, h3, h4, h5, h6");
    if (!heading || heading.querySelector(":scope > .dact-copy-reference")) return;

    const identifier =
      label.dataset.pageId ||
      label.dataset.sectionId ||
      label.dataset.questionGroupId ||
      label.dataset.exerciseId ||
      label.textContent.trim();

    const button = document.createElement("button");
    button.type = "button";
    button.className = "dact-copy-reference";
    button.title = `Copy reference ${identifier}`;
    button.setAttribute("aria-label", `Copy reference ${identifier}`);
    button.innerHTML = '<i class="bi bi-clipboard" aria-hidden="true"></i>';

    button.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      if (heading.id) url.hash = heading.id;

      const title = headingTextWithoutControls(heading);
      const reference = `${identifier} — ${title}\n${url.toString()}`;

      try {
        await copyText(reference);
        button.classList.add("copied");
        button.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i>';
        button.setAttribute("aria-label", `Copied reference ${identifier}`);
        window.setTimeout(() => {
          button.classList.remove("copied");
          button.innerHTML = '<i class="bi bi-clipboard" aria-hidden="true"></i>';
          button.setAttribute("aria-label", `Copy reference ${identifier}`);
        }, 1600);
      } catch (error) {
        console.warn("Could not copy DACT reference", error);
      }
    });

    heading.appendChild(button);
  });
});
