# Developer Notes

- The readme of Sanscript.js library is helpful. Give it a read [here](https://github.com/indic-transliteration/sanscript.js).
- There are mainly 2 functions of the extension:

  1. Convert/transliterate the user's word in [Roman/Latin script](https://en.wikipedia.org/wiki/Latin_script) to [Devanagari script](https://en.wikipedia.org/wiki/Devanagari).
  2. Find all instances of the matching word in the document, highlight them and provide next and previous arrows to sequentially visit each instance.

-
- Using Tesseract OCR

1. Page Segmentation Mode (PSM) are integer options available to us, to tell tesseract, how our text is arranged on the page.

---

# To do list

- Check whether e bar is a valid IAST character and is worth adding to rules object.
- Make sure that once we obtain the right Sanskrit/Hindi word, that we are able to use it to find occurences in a pdf.
