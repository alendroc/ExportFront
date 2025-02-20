import {server} from './global.js'
import { Service } from './Service.js'; 

export class VariedadesService extends Service{
    constructor() {
        super();
        this.apiUrl = server.url;
    }

    async getAll(){
        const subclase="variedades"
        return super.getAll(subclase,subclase,subclase)
    }
    // async getAll() {
    //     try {
    //         const response = await fetch(`${this.apiUrl}variedades`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error al obtener las variedades: ${response.statusText}`);
    //         }
    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             console.log('exitooooo.');
    //             return { success: true, variedades: data.variedades };
    //         } else {
    //             console.log('No se encontraron variedades.');
    //             return { success: false, status: data.status };
    //         }

    //     }catch (error){
    //         if (error.message.includes('Failed to fetch')) {
    //             throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
    //         } else {
    //             throw new Error(error.message, error);
    //         }
    //     }
    // }

   /* async getById(id) {
        try {
            const response = await fetch(`${this.apiUrl}variedades/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('variedad no encontrada.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener la variedad: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, variedades: data.variedades };
            } else {
                console.log('variedad no encontrada.');
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
    async create(variedad) {
        try {
            console.log("Articulo por agregar:", variedad)
            const response = await fetch(`${this.apiUrl}variedades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(variedad)
            });

            if (!response.ok) {
                throw new Error(`Error al crear la variedad: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, variedad: data.variedad };
            } else {
                console.log('Error al crear la varidad.');
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

    async update(cultivo, variedad, variedades) {
        try {
            console.log("Cultivo:", cultivo, "Variedad:", variedad, "Datos a actualizar:", variedades)
            const response = await fetch(`${this.apiUrl}variedades/${cultivo}/${variedad}`, {
                
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(variedades)
            });
            console.log(response)

            if (!response.ok) {
                throw new Error(`Error al actualizar la variedad: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, variedades: data.variedades };
            } else {
                console.log('Error al actualizar la variedad.');
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

    async delete(cultivo, variedad){
        const url=`variedades/${cultivo}/${variedad}`;
        const dataName="variedad"
        return super.delete(url,dataName)
    }
    // async delete(cultivo, variedad) {
    //     try {
    //         console.log(cultivo, variedad,)
    //         const response = await fetch(`${this.apiUrl}variedades/${cultivo}/${variedad}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.status === 404) {
    //             throw new Error('variedad no encontrado.');
    //         }

    //         if (!response.ok) {
    //             throw new Error(`Error al eliminar la variedad: ${response.statusText}`);
    //         }

    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             return { success: true, message: data.message };
    //         } else {
    //             console.log('Error al eliminar la variedad.');
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