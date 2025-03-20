import { Service } from './Service.js';

export class ProductosLaborPoService extends Service {
    constructor() {
        super();
    }

    async getAll() {
        const url = "PoProductosLabor";
        const dataName = "poProductosLabor";
        const data = "poProductosLabor";

        return super.getAll(url, dataName, data);
    }

    async getByTempSiembraNumDepLabAliasDdt(temporada, siembraNum, departamento, labor, aliasLabor, ddt) {
        const url = `PoProductosLabor/${encodeURIComponent(temporada)}/${encodeURIComponent(siembraNum)}/${encodeURIComponent(departamento)}/${encodeURIComponent(labor)}/${encodeURIComponent(aliasLabor)}/${encodeURIComponent(ddt)}`;
        const dataName = "poProductosLabor";
        const data = "poProductosLabor";

        return super.getAll(url, dataName, data);
    }

    async create(productoLaborPo) {
        const url = "PoProductosLabor";
        const dataName = "poProductoLabor";
        return super.create(url, productoLaborPo, dataName);
    }

    async update(temporada, siembraNum, departamento, labor, aliasLabor, ddt, idProducto, productoLaborPoUpdate) {
        const url = `PoProductosLabor/${encodeURIComponent(temporada)}/${encodeURIComponent(siembraNum)}/${encodeURIComponent(departamento)}/${encodeURIComponent(labor)}/${encodeURIComponent(aliasLabor)}/${encodeURIComponent(ddt)}/${encodeURIComponent(idProducto)}`;
        const dataName = "productLabPo";
        return super.update(url, productoLaborPoUpdate, dataName);
    }

    async delete(temporada, siembraNum, departamento, labor, aliasLabor, ddt, idProducto) {
        const url = `PoProductosLabor/${encodeURIComponent(temporada)}/${encodeURIComponent(siembraNum)}/${encodeURIComponent(departamento)}/${encodeURIComponent(labor)}/${encodeURIComponent(aliasLabor)}/${encodeURIComponent(ddt)}/${encodeURIComponent(idProducto)}`;
        const dataName = "productoLaborPo";
        return super.delete(url, dataName);
    }
}