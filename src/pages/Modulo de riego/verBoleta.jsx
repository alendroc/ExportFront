import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PedidoProductosPOService } from "../../services/PedidoProductosPOService";

export function VerBoleta(data) {

    var pedidoProductosPoService = new PedidoProductosPOService();
    var ddt = data.data;

    const [products, setProducts] = useState([]);

    const [fechaActual, setFechaActual] = useState('');
    const [fechaFormateada, setFechaFormateada] = useState('');

    useEffect(() => {
        const fecha = new Date();
        const opciones = {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            timeZone: 'America/Costa_Rica',
        };

        const formateada = fecha.toLocaleDateString('en-GB', opciones);
        setFechaActual(formateada);
    }, []);

    useEffect(() => {
        console.log("ddt.fechaTrasplante", products[0]?.fechaBase);
        const fecha = new Date(`${products[0]?.fechaBase}T00:00:00`);

        const opciones = {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            timeZone: 'America/Costa_Rica',
        };

        const formateada = fecha.toLocaleDateString('en-GB', opciones);
        setFechaFormateada(formateada);
    }, [products]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await pedidoProductosPoService.getByDdt(ddt.temporada, ddt.siembraNumero, ddt.departamento, "MELÓN",
                    ddt.aliasLabor, ddt.aliasLote, ddt.fechaTrasplante, ddt.ddt, ddt.area
                ).then((res) => {
                    console.log("res", res);
                    console.log("res.poPedidoProductos", res.poPedidoProductos);
                    setProducts(res.poPedidoProductos)
                })
            }
            catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        }
        fetchData();
    }, []);

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
                                Boleta Nº {products[0]?.numBoleta}
                            </div>
                            <div className="mt-2">
                                <div><strong>Temporada:</strong> {products[0]?.temporada}</div>
                                <div><strong>Lote:</strong> {products[0]?.aliasLote}</div>
                            </div>
                        </div>
                        <div className="text-center">
                            <img src="/logoExpor.jpeg" alt="logo" className="mx-auto mb-1 w-16" />
                            <div className="text-lg font-bold">EXPORPACK S.A.</div>
                            <div className="text-sm">Solicitud de materiales</div>
                        </div>
                    </div>

                    {/* Info general */}
                    <div className="border border-black p-2 mb-2 text-xs">
                        <div className="flex justify-between">
                            <div><strong>Cultivo:</strong> MELÓN</div>
                            <div><strong>Área:</strong> {products[0]?.areaSiembra}</div>
                            <div><strong>Fecha de Solicitud:</strong> {fechaActual}</div>
                        </div>
                        <div className="flex justify-between mt-1">
                            <div><strong>Fecha de Aplicación:</strong> {fechaFormateada}</div>
                            <div><strong>Días dt/dc/s:</strong> {products[0]?.ddt}</div>
                            <div><strong>Reales:</strong> {products[0]?.ddt}</div>
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
                            {products.map((item) => (
                                <tr key={item.idPedido}>
                                    <td className="border border-black px-1 py-1">{item.idProducto}</td>
                                    <td className="border border-black px-1 py-1 text-right">{item.unidadesPorLote}</td>
                                    <td className="border border-black px-1 py-1 text-center">{item.unidadMedida}</td>
                                    <td className="border border-black px-1 py-1">{item.nombreDescriptivo}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="border border-black px-2 py-4 text-center text-xs">
                                    {products[0]?.aprueba || ""}
                                </td>
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
const Container = styled.div`
 
  `
