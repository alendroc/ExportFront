import { Service } from './Service.js';

export class ProductosLaborPo extends Service{
    constructor() {
        super();
    }

    async getAll(){
        const url="PoProductosLabor"
        const dataName ="poProductosLabor"
        const data="poProductosLabor"

        return super.getAll(url,dataName,data)
    }

    async getByTempSiembraNumDepLabAliasDdt(temporada,siembraNum, departamento, labor, aliasLabor, ddt){
        const url=`PoProductosLabor/${temporada}${siembraNum}${departamento}${labor}${aliasLabor}${ddt}`
        const dataName ="poProductosLabor"
        const data="poProductosLabor"

        return super.getAll(url,dataName,data)
    }

    async create(productoLaborPo) {
       const url="PoProductosLabor"
       const dataName="poProductoLabor"
       return super.create(url,productoLaborPo,dataName)
    }

    async update(temporada, siembraNum, departamento, labor, aliasLabor,ddt,idProducto, productoLaborPoUpdate){
        const url=`PoProductosLabor/${temporada}${siembraNum}${departamento}${labor}${aliasLabor}${ddt}${idProducto}`
        const dataName="productLabPo"
        return super.update(url,productoLaborPoUpdate,dataName)
    }

    async delete(temporada, siembraNum, departamento, labor, aliasLabor,ddt,idProducto){
        const url=`PoProductosLabor/${temporada}${siembraNum}${departamento}${labor}${aliasLabor}${ddt}${idProducto}`
        const dataName="productoLaborPo"
        return super.delete(url,dataName)
    }
}