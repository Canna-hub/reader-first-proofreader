const manuscript = document.getElementById("manuscript");
const analyzeButton = document.getElementById("analyzeButton");
const results = document.getElementById("results");

analyzeButton.addEventListener("click", analyzeWriting);

function analyzeWriting() {
  const text = manuscript.value.trim();

  results.innerHTML = "";

  if (!text) {
    results.innerHTML = "<p>Please paste some writing first.</p>";
    return;
  }

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 20);

  const duplicates = [];

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {

      const first = normalize(sentences[i]);
      const second = normalize(sentences[j]);

      if (first === second) {
        duplicates.push({
          first: sentences[i],
          second: sentences[j]
        });
      }
    }
  }

  if (duplicates.length === 0) {
    results.innerHTML = `
      <h3>No obvious duplicate sentences found.</h3>
      <p>
        This does not mean the manuscript is perfect.
        It simply means this first check did not find
        an obvious exact repetition.
      </p>
    `;

    return;
  }

  results.innerHTML = `
    <h3>Possible repeated content</h3>
  `;

  duplicates.forEach(item => {
    const card = document.createElement("div");

    card.innerHTML = `
      <p><strong>Passage A:</strong></p>
      <p>${escapeHTML(item.first)}</p>

      <p><strong>Passage B:</strong></p>
      <p>${escapeHTML(item.second)}</p>

      <p>
        This appears to repeat information the reader has
        already received. If intentional, you can ignore it.
      </p>
    `;

    results.appendChild(card);
  });
}

function normalize(sentence) {
  return sentence
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
    }
