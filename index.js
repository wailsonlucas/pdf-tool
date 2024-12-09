const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

async function overlayImageOnPDF(inputPdfPath, outputPdfPath, imagePath) {
    // Load the existing PDF
    const existingPdfBytes = fs.readFileSync(inputPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Load the image
    const imageBytes = fs.readFileSync(imagePath);
    const image = await pdfDoc.embedPng(imageBytes); // or embedJpg for JPG images
    const { width, height } = image.size();

    // Iterate through each page and overlay the image
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        // Define the position to place the image
        const x = 10; // x position of the image
        const y = page.getHeight() - height - 10; // y position of the image (10 units from the top)

        // Draw the image on the current page
        page.drawImage(image, {
            x: x,
            y: y,
            width: width,  // Set the width of the image
            height: height, // Set the height of the image
        });
    }

    // Serialize the new PDF document to bytes
    const newPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, newPdfBytes);
}

// Example usage
const inputPdf = 'a.pdf'; // Existing PDF file
const outputPdf = 'output.pdf'; // Output PDF file
const imagePath = 'overlay.png'; // Image to overlay

overlayImageOnPDF(inputPdf, outputPdf, imagePath)
    .then(() => console.log('Image overlay completed on each page.'))
    .catch(err => console.error('Error:', err));