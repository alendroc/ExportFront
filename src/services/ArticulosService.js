import {server} from './global.js'
import { Service } from './Service.js';

export class ArticulosService extends Service{
    constructor() {
        super();
        this.apiUrl = server.url;
    }

    async getAll(){
        const subclase="articulos"
        return super.getAll(subclase,subclase,subclase)
    }

    /*async getById(id) {
        try {
            const response = await fetch(`${this.apiUrl}articulos/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Articulo no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el Articulo: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, articulos: data.articulos };
            } else {
                console.log('Articulo no encontrado.');
                return { success: false, status: data.status };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {

                throw new Error(error.message, error);
            }
        }
    }*/
    async create(articulo) {
        const url="articulos"
        const dataName="articulo"
        return super.create(url,articulo,dataName)
    }
    /*async create(articulo) {
        try {
            console.log("Articulo por agregar:", articulo)
            const response = await fetch(`${this.apiUrl}articulos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articulo)
            });

            if (!response.ok) {
                throw new Error(`Error al crear el articulo: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, articulo: data.articulo };
            } else {
                console.log('Error al crear el articulo.');
                return { success: false, status: data.status };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message, error);
            }
        }
    }*/

        async update(id,articulos){
            const url=`articulos/${id}`;
            const dataName="articulos"
            return super.update(url,articulos,dataName)
        }
    // async update(id, articulos) {
    //     try {
    //         console.log("el ide: ",id,"el articulo: ",articulos)
    //         const response = await fetch(`${this.apiUrl}articulos/${id}`, {
                
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(articulos)
    //         });
    //         console.log(response)

    //         if (!response.ok) {
    //             throw new Error(`Error al actualizar el articulo: ${response.statusText}`);
    //         }

    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             return { success: true, articulos: data.articulos };
    //         } else {
    //             console.log('Error al actualizar el articulo.');
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

    async delete(id){
        const url=`articulos/${id}`;
        const dataName="articulo"
        return super.delete(url,dataName)
    }
    // async delete(id) {
    //     try {
    //         console.log(id)
    //         const response = await fetch(`${this.apiUrl}articulos/${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.status === 404) {
    //             throw new Error('articulo no encontrado.');
    //         }

    //         if (!response.ok) {
    //             throw new Error(`Error al eliminar el articulo: ${response.statusText}`);
    //         }

    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             return { success: true, message: data.message };
    //         } else {
    //             console.log('Error al eliminar el articulo.');
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

    
}
