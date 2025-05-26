import styled from "styled-components";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export function NavegacionP() {

  const pdfRef = useRef();

  /*const exportPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("solicitud-materiales.pdf");
    });
  };*/

  return (
    <Container>
      Navegación
    </Container>);
}
const Container = styled.div`
 
  `
