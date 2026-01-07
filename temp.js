import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const filePath1 = "pdfs/06_Chapter_Sanskrit.pdf";
const filePath2 = "pdfs/Book 6 Mausal-parva.pdf";

async function loadPdf(filePath) {
  let pdf;
  try {
    // read pdf as raw bytes
    const data = new Uint8Array(fs.readFileSync(filePath));

    // load the pdf from bytes
    pdf = await pdfjsLib.getDocument({ data }).promise;

    console.log("PDF loaded successfully");
    console.log("Number of pages: ", pdf.numPages);
  } catch (err) {
    console.log("Failed to load PDF:", err);
  }
  return pdf;
}
async function findWord(word, filePath) {
  let pdf = loadPdf(filePath2);
  // const pdf = pdfjsLib.getDocument(filePath).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const textItems = textContent.items.map((item) => item.str);
    fullText += textItems.join(" ") + "\n";
  }

  const searchWord = word;

  // replace regex meta characters
  const escaped = searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = fullText.match(new RegExp(escaped, "g")) || [];
  console.log(`Found ${matches.length} matches of "${searchWord}" in the PDF.`);
}

import Tesseract, { createWorker } from "tesseract.js";

let languages = ["eng", "hin", "san"];

async function performOCR(filePath) {
  const worker = await createWorker("san+hin");
  try {
    await worker.reinitialize("san+hin");

    await worker.setParameters({
      tessedit_pageseg_mode: "6", // PSM 11 is for extracting as much text as possible with no particular order
    });

    const result = await worker.recognize(filePath);

    const text = result.data.text;
    await fs.writeFile("output_page_sanskrit.txt", text);
    console.log(text);

    return text;
  } finally {
    await worker.terminate();
  }
}

const filePath = "./sanskrit_page_image.png";
// const filePath = "./eng_image.png";
// performOCR(filePath);

// findWord("बन्धु", filePath2);
//
// Match number 8 is Chapter 3 shlok 11
// Duck Duck Go found 16 matches, same as PDF.js library
// firefox found 32 matches
// Microsoft Edge found None
// Chrome found 16 matches
//

function normalizeInputWord(word) {
  return word
    .toLowerCase()
    .replace(/ee|ii/g, "ī")
    .replace(/aa/g, "ā")
    .replace(/oo|uu/, "ū");
}

function getPossibleIASTInterpretations(input) {
  input = input.toLowerCase().trim();
  const letters = input.split("");

  const rules = {
    a: ["a", "ā"],
    e: ["e"], // check for e bar
    i: ["i", "ī"],
    o: ["o", "ō"],
    u: ["u", "ū"],

    d: ["d", "ḍ", "ḍa"],

    l: ["ḷ", "l̤"],
    m: ["m", "ṁ"],
    n: ["n", "ṇ", "ṇa", "ṅ", "ñ"],

    r: ["r", "ṛ", "ṝ"],
    s: ["s", "ś", "ṣ"],
    t: ["t", "ṭ", "ṭa"],
  };

  let candidates = [""];
  letters.forEach((letter, index) => {
    const isFinalLetter = index === letters.length - 1;
    let letterInterpretations = rules[letter] || [letter];

    if (isFinalLetter) {
      if (letter === "h") letterInterpretations = ["ḥ"];
      if (letter == "m") letterInterpretations = ["m", "ṃ"];
      if (letter == "n") letterInterpretations = ["n", "ṇ"];
    }

    const nextCandidates = [];
    for (const partialWord of candidates) {
      // for every partial word created yet
      for (const i of letterInterpretations) {
        // append all interpretations of current letter
        nextCandidates.push(partialWord + i);
      }
    }
    candidates = nextCandidates; // update final results array
  });

  let results = [];
  for (const word of candidates) {
    if (isCorrectIASTWord(word)) {
      results.push(word);
    }
  }
  return results;
}

function isCorrectIASTWord(word) {
  if (word.includes("aa") || word.includes("aā") || word.includes("āa")) {
    return false;
  }
  return true;
}

function getDevanagariEquivalent(word) {
  let normalizedWord = normalizeInputWord(word);
  let iastInterpretations = getPossibleIASTInterpretations(normalizedWord);
}

function main() {
  // const word = "pārtha";
  const word = "paartha";
  // const word = "saṃskṛtam";
  let normalizedWord = normalizeInputWord(word);
  console.log(getPossibleIASTInterpretations(normalizedWord));
}

main();
