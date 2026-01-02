// file: popup.js
// authors: Yug Patel
// last modified: 12/28/2025

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

function getPossibleIASTCandidates(input){
    input = input.toLowerCase().trim();
    const letters = input.split("");
    
    const rules = {
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