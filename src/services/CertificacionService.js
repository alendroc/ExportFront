import { Service } from './Service.js';

export class CertificacionService extends Service{  
    
    constructor() { 
        super();
    }  

    async getAll(){
        const subclase="certificaciones"
        return super.getAll(subclase,subclase,subclase)
    }

    async getByProductoId(idProducto) {  
        try {  
            const response = await fetch(`${this.getApiUrl()}${idProducto}`, {  
                method: 'GET',  
                headers: {  
                    'Content-Type': 'application/json'  
                }  
            });  

            if (!response.ok) {  
                throw new Error(`Error al obtener las certificaciones: ${response.statusText}`);  
            }  

            const data = await response.json();
            console.log("Respuesta de la API:", data);

            if (data.isSuccess && data.status === 200 && Array.isArray(data.certificaciones)) {  
                return { success: true, certificaciones: data.certificaciones };  
            } else {  
                console.log('No se encontraron certificaciones para este producto:', idProducto);  
                return { success: false, status: data.status, certificaciones: [] };  
            }
            
        } catch (error) {  
            if (error.message.includes('Failed to fetch')) {  
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');  
            } else {  
                throw new Error(error.message);  
            }  
        }  
    }  

    async create(certificacion) {
        const url="certificaciones"
        const dataName="certificacion"
        return super.create(url,certificacion,dataName)
    }

    async update(idProducto, nombreCertificacion, certificacion){
        const url=`certificaciones/${idProducto}/${nombreCertificacion}`;
        const dataName="certificacion"
        return super.update(url,certificacion,dataName)
    }

    async delete(idProducto, nombreCertificacion){
        const url=`certificaciones/${idProducto}/${nombreCertificacion}`;
        const dataName="certificación"
        return super.delete(url,dataName)
    }
}