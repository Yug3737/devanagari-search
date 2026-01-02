// wait for pdf to finish loading
console.log("Content script injected on", window.location.href);
window.addEventListener("load", async () => {
    const url = window.location.href;

    // load pdf
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;

    let fulltext = "";

    for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++){
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map(item => item.str);
        fulltext += textItems.join(" ") + "\n";
    }

    const searchWord = "धनुष";

    const matches = fulltext.match(new RegExp(searchWord, "g")) || [];
    console.log(`Found ${matches.length} matches of "${searchWord}" in the PDF`);
})