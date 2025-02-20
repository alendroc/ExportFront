import { server } from './global.js'; 
import { Service } from './Service.js'; 

export class CertificacionService extends Service{  
    
    constructor() { 
        super(); 
        this.apiUrl = server.url; // Asegúrate de que la URL sea correcta  
    }  

    async getAll(){
        const subclase="certificaciones"
        return super.getAll(subclase,subclase,subclase)
    }

    // async getAll() {  
    //     try {  
    //         const response = await fetch(this.apiUrl, {  
    //             method: 'GET',  
    //             headers: {  
    //                 'Content-Type': 'application/json'  
    //             }  
    //         });  

    //         if (!response.ok) {  
    //             throw new Error(`Error al obtener las certificaciones: ${response.statusText}`);  
    //         }  

    //         const data = await response.json();  
    //         console.log("Respuesta de la API:", data);  

    //         if (data.isSuccess && data.status === 200 ) {  
    //             return { success: true, certificaciones: data.certificaciones };  
    //         } else {  
    //             console.log('No se encontraron certificaciones.');  
    //             return { success: false, status: data.status, certificaciones: [] };  
    //         }  
    //     } catch (error) {  
    //         if (error.message.includes('Failed to fetch')) {  
    //             throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');  
    //         } else {  
    //             throw new Error(error.message);  
    //         }  
    //     }  
    // }  

    // Obtener certificaciones por ID de producto  
    async getByProductoId(idProducto) {  
        try {  
            const response = await fetch(`${this.apiUrl}${idProducto}`, {  
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
    /*async create(certificacion) {  
        try {  
            const response = await fetch(this.apiUrl, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json'  
                },  
                body: JSON.stringify(certificacion)  
            });  

            if (!response.ok) {  
                const errorData = await response.json();  
                throw new Error(`Error al crear la certificación: ${errorData.message || response.statusText}`);  
            }  

            const data = await response.json();  

            if (data.isSuccess && data.status === 201) {  
                return { success: true, certificacion: data.certificacion };  
            } else {  
                console.log('Error al crear la certificación.');  
                return { success: false, status: data.status };  
            }  
        } catch (error) {  
            if (error.message.includes('Failed to fetch')) {  
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');  
            } else {  
                throw new Error(error.message);  
            }  
        }  
    }  */

        // Actualizar una certificación por ID y nombre de certificación  
        async update(idProducto, nombreCertificacion, certificacion){
            const url=`${idProducto}/${nombreCertificacion}`;
            const dataName="certificacion"
            return super.update(url,certificacion,dataName)
        }
        // async update(idProducto, nombreCertificacion, certificacion) {  
        //     try {  
        //         const response = await fetch(`${this.apiUrl}${idProducto}/${nombreCertificacion}`, {  
        //             method: 'PUT',  
        //             headers: {  
        //                 'Content-Type': 'application/json'  
        //             },  
        //             body: JSON.stringify(certificacion)  
        //         });  
    
        //         if (!response.ok) {  
        //             throw new Error(`Error al actualizar la certificación: ${response.statusText}`);  
        //         }  
    
        //         const data = await response.json();  
    
        //         if (data.isSuccess && data.status === 200) {  
        //             return { success: true, certificacion: data.certificacion };  
        //         } else {  
        //             console.log('Error al actualizar la certificación.');  
        //             return { success: false, status: data.status };  
        //         }  
        //     } catch (error) {  
        //         if (error.message.includes('Failed to fetch')) {  
        //             throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');  
        //         } else {  
        //             throw new Error(error.message);  
        //         }  
        //     }  
        // }  
    
        async delete(idProducto, nombreCertificacion){
            const url=`${idProducto}/${nombreCertificacion}`;
            const dataName="certificación"
            return super.delete(url,dataName)
        }
        // Eliminar una certificación por ID y nombre de certificación  
        // async delete(idProducto, nombreCertificacion) {  
        //     try {  
        //         const response = await fetch(`${this.apiUrl}${idProducto}/${nombreCertificacion}`, {  
        //             method: 'DELETE',  
        //             headers: {  
        //                 'Content-Type': 'application/json'  
        //             }  
        //         });  
    
        //         if (!response.ok) {  
        //             const errorData = await response.json();  
        //             throw new Error(`Error al eliminar la certificación: ${errorData.message || response.statusText}`);  
        //         }  
    
        //         const data = await response.json();  
    
        //         if (data.isSuccess && data.status === 200) {  
        //             return { success: true, message: data.message };  
        //         } else {  
        //             console.log('Error al eliminar la certificación.');  
        //             return { success: false, status: data.status };  
        //         }  
        //     } catch (error) {  
        //         if (error.message.includes('Failed to fetch')) {  
        //             throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');  
        //         } else {  
        //             throw new Error(error.message);  
        //         }  
        //     }  
        // }  
    }  