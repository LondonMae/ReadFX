// URL of the PDF file
const pdfUrl = 'https://arxiv.org/ftp/arxiv/papers/2312/2312.11757.pdf';

// Reference to PDF container
const pdfViewer = document.getElementById('pdf-viewer');

// Asynchronous function to load and render the PDF
async function renderPDF(url, container) {
    // Fetch the PDF document
    const pdfDoc = await pdfjsLib.getDocument(url).promise;

    // Number of pages in the PDF
    const numPages = pdfDoc.numPages;

    // Loop through each page and render it
    for (let i = 1; i <= numPages; i++) {
        // Get the page
        const page = await pdfDoc.getPage(i);

        // Create a div element for the page
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        container.appendChild(pageDiv);

        // Render the original page content
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const renderContext = {
        canvasContext: context,
        viewport: viewport
        };
        await page.render(renderContext).promise;
        pageDiv.appendChild(canvas);

        // Render the text layer
        const textLayerDiv = document.createElement('div');
        textLayerDiv.className = 'textLayer';
        pageDiv.appendChild(textLayerDiv);
        const textLayer = pdfjsLib.renderTextLayer({
            textContent: await page.getTextContent(),
            container: textLayerDiv,
            viewport: viewport,
            textDivs: []
        });

        // Set the size of the page container
        pageDiv.style.width = `${viewport.width}px`;
        pageDiv.style.height = `${viewport.height}px`;
    }
}

// Call the function to render the PDF
renderPDF(pdfUrl, pdfViewer);