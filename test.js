// file: test.js
// author: Yug Patel
// last modified: 6 Jan 2026
// test file to assert correct functionality for functions

import { getDevanagariEquivalent } from "./temp";

function testGetTransliteration() {
  let input = "raama",
    output = "राम";

  let inputOutputDict = {
    yoga: "योग",
    namaste: "नमस्ते",
    saṃskṛtam: "संस्कृतम्",
    gaandeeva: "गाण्डीव",
  };
  for (const [input, output] of Object.entries(inputOutputDict)) {
    console.assert(
      input === getDevanagariEquivalent(output),
      `Error: ${input} is not being converted to ${output}`
    );
  }
}

function test() {
  testGetPosssibleIASTInterpretations();
}

test();
