import { Service } from './Service.js';

export class PedidoProductosPOService extends Service {
    constructor() {
        super();
    }

    async getAll() {
        const url = "PoPedidoProductos";
        const dataName = "poPedidoProductos";
        const data = "poPedidoProductos";

        return super.getAll(url, dataName, data);
    }

    async show(idPedido, idProducto, numBoleta) {
        const url = `PoPedidoProductos/${encodeURIComponent(idPedido)}/${encodeURIComponent(idProducto)}/${encodeURIComponent(numBoleta)}`;
        const dataName = "poPedidoProductos";
        const data = "poPedidoProductos";

        return super.getAll(url, dataName, data);
    }

    async getByDdt(temporada, siembraNum, departamento, cultivo, aliasLabor, aliasLote, fechaBase, ddt, areaSiembra) {
        const url = `PoPedidoProductos/${encodeURIComponent(temporada)}/${encodeURIComponent(siembraNum)}/${encodeURIComponent(departamento)}
        /${encodeURIComponent(cultivo)}/${encodeURIComponent(aliasLabor)}/${encodeURIComponent(aliasLote)}/${encodeURIComponent(fechaBase)}
        /${encodeURIComponent(ddt)}/${encodeURIComponent(areaSiembra)}`;
        const dataName = "poPedidoProductos";
        const data = "poPedidoProductos";

        return super.getAll(url, dataName, data);
    }

    async create(poPedidoProductos) {
        const url = "PoPedidoProductos";
        const dataName = "poPedidoProductos";
        return super.create(url, poPedidoProductos, dataName);
    }
}