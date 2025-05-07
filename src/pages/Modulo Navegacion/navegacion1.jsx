import styled from "styled-components";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export function NavegacionP() {

  const pdfRef = useRef();

  const exportPDF = () => {
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
  };

    return (
    <Container>
  <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={exportPDF}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Descargar PDF
      </button>

      <div ref={pdfRef} className="bg-white p-6 w-[794px] mx-auto shadow text-sm font-sans border border-gray-300">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="border border-black text-center text-red-600 font-bold text-sm px-2 py-1">
              Boleta Nº 14477
            </div>
            <div className="mt-2">
              <div><strong>Temporada:</strong> 2024-2025</div>
              <div><strong>Lote:</strong> 24Ga</div>
            </div>
          </div>
          <div className="text-center">
            <img src="https://via.placeholder.com/80" alt="logo" className="mx-auto mb-1" />
            <div className="text-lg font-bold">EXPORPACK S.A.</div>
            <div className="text-sm">Solicitud de materiales</div>
          </div>
        </div>

        {/* Info general */}
        <div className="border border-black p-2 mb-2 text-xs">
          <div className="flex justify-between">
            <div><strong>Cultivo:</strong> MELÓN</div>
            <div><strong>Área:</strong> 1.86</div>
            <div><strong>Fecha de Solicitud:</strong> Tuesday, 07/01/2025</div>
          </div>
          <div className="flex justify-between mt-1">
            <div><strong>Fecha de Aplicación:</strong> Wednesday, 08/01/2025</div>
            <div><strong>Días dt/dc/s:</strong> 4</div>
            <div><strong>Reales:</strong> 4</div>
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full border border-black border-collapse text-xs">
  <thead className="bg-blue-200">
    <tr>
      <th className="border border-black px-1 py-1">Código</th>
      <th className="border border-black px-1 py-1">Cant.</th>
      <th className="border border-black px-1 py-1">Unidad</th>
      <th className="border border-black px-1 py-1">Detalle de los productos solicitados</th>
    </tr>
  </thead>
  <tbody>
    {[
      ["10-0027", "1.8", "L", "Fertilizante Nitrato de Zinc 9.4-0-0+22 ZnS"],
      ["10-0050", "44", "Kg", "MAP 12-61-0"],
      ["10-0124", "37", "Kg", "Cloruro de Potasio (Kg) (62%:K2O)"],
      ["10-0129", "0.037", "Kg", "Molibdato de Sodio (Kg) (99.4%, NaMo)"],
      ["10-0133", "3.7", "Kg", "Sulfato de Magnesio (Kg) (16%:Mg - 13%:S)"],
      ["10-0150", "22", "Kg", "Urea (46%:N)"],
      ["10-0160", "12", "Kg", "Nitrato de Amonio (Kg) (33.5%:N)"],
    ].map(([codigo, cant, unidad, detalle]) => (
      <tr key={codigo}>
        <td className="border border-black px-1 py-1">{codigo}</td>
        <td className="border border-black px-1 py-1 text-right">{cant}</td>
        <td className="border border-black px-1 py-1 text-center">{unidad}</td>
        <td className="border border-black px-1 py-1">{detalle}</td>
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr>
      <td className="border border-black px-2 py-4 text-center text-xs">OCONEJO_001529</td>
      <td className="border border-black px-2 py-4 text-center text-xs">Aprueba</td>
      <td className="border border-black px-2 py-4 text-center text-xs">Entrega</td>
      <td className="border border-black px-2 py-4 text-center text-xs">Recibe distribuidor / cabezalero</td>
    </tr>
  </tfoot>
</table>


        {/* Firmas */}
        
      </div>
    </div>
    </Container>);
  }
  const Container =styled.div`
 
  `
