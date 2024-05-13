// chartExports.js
import { toJpeg, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const exportAsImage = async (node, imageType = 'jpeg') => {
    try {
        const dataUrl = await toJpeg(node, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `chart.${imageType}`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.log(err);
    }
};

export const exportAsPDF = async (node) => {
    try {
        const imgData = await toPng(node);
        const pdf = new jsPDF({
            orientation: 'landscape',
        });
        pdf.addImage(imgData, 'PNG', 25, -25);
        pdf.save('line-chart.pdf');
    } catch (err) {
        console.log(err);
    }
};

export const printChart = () => {
    window.print();
};
