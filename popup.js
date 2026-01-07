// file: popup.js
// authors: Yug Patel
// last modified: 12/28/2025

import fs from 'fs/promises';

import { createWorker } from 'tesseract.js';
import { exec } from 'child_process';

console.log("popup.js is loaded");

const input = document.getElementById('inputText');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const outputDiv = document.getElementById('output');
const errorDiv = document.getElementById('error');

console.log("Sanscript is", typeof Sanscript);
const test = Sanscript.t("paartha", "itrans", "devanagari");
console.log(test);

let inputText = '';
let outputText = '';

function renderPDFAsImages(){
    exec(
        'pdftoppm -png -r 300 "input.pdf" "pages/page',
        (err, stdout, stderr) => {
            if(err){
                console.error("Poppler error", err);
                return;
            }
            console.log("Pages rendered successfully");
        }
    );
}

function getPossibleIASTCandidates(input){
    input = input.toLowerCase().trim();
    const letters = input.split("");
    
    const rules = {
        // paartha, IAST = p(abar)rtha
        a:["a", "ā"],
        e: ["e"], // check for e bar
        i: ["i", "ī"],
        u: ["u", "ū"],

        t: ["t", "ṭ", "ṭa"],
        d: ["d", "ḍ", "ḍa"],
        n: ["n", "ṇ", "ṇa"],
        s: ["s", "ś", "ṣ"]
    }

    let results = [""];
    letters.forEach((letter, index)=> {
        const isFinalLetter = index === letters.length - 1;
        let letterInterpretations = rules[letter] || [letter];
        
        if(isFinalLetter){
            if(token === "h") letterInterpretations = ["ḥ"];
            if(token == "m") letterInterpretations = ["m", "ṃ"];
            if(token == "n") letterInterpretations = ["n", "ṇ"];
        }
        
        const nextResults = [];
        for(const partialWord of results){ // for every partial word created yet
            for(const i of letterInterpretations){ // append all interpretations of current letter
                nextResults.push(partialWord + i);
            }
        }
        results = nextResults; // update final results array
    });
        
}
// [partha, p(abar)tha, paartha, p(abar)(abar)tha, p(abar)rth(abar)]

function filterIASTCandidates(candidates){
    // valid word endings
    
    res = [];
    for(let c of candidates){
        if(!c.includes("aa")){
            res.push(c);
        }
    }
    return res;
}

async function computePagewiseOCRWithTesseract(filePath){
    const worker = await createWorker("san+hin");
    try{
        await worker.reinitialize("san+hin");
        
        await worker.setParameters({
            tessedit_pageseg_mode: "6" // PSM 11 is for extracting as much text as possible with no particular order
        });

        const result = await worker.recognize(filePath);
        
        const text = result.data.text;
        await fs.writeFile("output_page_sanskrit.txt", text);
        console.log(text);
        
        return text;
    } finally{
        await worker.terminate();
    }
}

input.addEventListener('blur', () =>{
    // clean the input word
    inputText = input.value.trim().toLowerCase();
    if(inputText.includes(" ")){
        errorDiv.innerText = "Input contains a space character, please enter a single word.";
    }
    
    // generate phonetic interpretations
    // 1. Vowels.
    
    // 2. Consonants
    
    
    
})
searchBtn.addEventListener('click', () =>{
    if(text && typeof Sanscript !== 'undefined'){
        const result = Sanscript.t(text, 'itrans', 'devanagari');
        output.textContent = result;
    }else{
        output.textContent = 'Sanscript not loaded!';
    }
});

clearBtn.addEventListener('click', ()=>{
    input.value = '';
    output.textContent = '';
});

function main(){
    const word = "pārtha";
    getPossibleIASTCandidates(word);
}