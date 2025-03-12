import { Service } from './Service.js'; 

export class ProductoService extends Service{
    
    constructor() {
        super();
    }
    
    async getAll(){
        const subclase="productos";
        return super.getAll(subclase,subclase,subclase)
    }

    async getIdNameType() {
        try {
            const response = await fetch(`${super.getApiUrl()}productos/asignar/para/ddt`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener los productos: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, productos: data.productos };
            } else {
                return { success: false, status: data.status };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message, error);
            }
        }
    }

    // Obtener un producto por ID
    // async getById(id) {
    //     try {
    //         const response = await fetch(`${this.getApiUrl()}productos/${id}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.status === 404) {
    //             throw new Error('Producto no encontrado.');
    //         }

    //         if (!response.ok) {
    //             throw new Error(`Error al obtener el producto: ${response.statusText}`);
    //         }

    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             return { success: true, producto: data.producto };
    //         } else {
    //             console.log('Producto no encontrado.');
    //             return { success: false, status: data.status };
    //         }
    //     } catch (error) {
    //         if (error.message.includes('Failed to fetch')) {
    //             throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
    //         } else {
    //             throw new Error(error.message, error);
    //         }
    //     }
    // }

    async create(producto){
        const url="productos";
        const dataName="producto";
        return super.create(url,producto,dataName)
    }

    async update(id, producto){
        const url=`productos/${id}`;
        const dataName="producto"
        return super.update(url,producto,dataName)
    }

    async delete(id){
        const url=`productos/${id}`;
        const dataName="Producto"
        return super.delete(url,dataName)
    }
   
}
