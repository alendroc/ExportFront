import {server} from './global.js'
import { Service } from './Service.js'; 

export class HibridosService extends Service{
    constructor() {
        super();
        this.apiUrl = server.url;
    }

    async getAll(){
        const subclase="hibridos"
        return super.getAll(subclase,subclase,subclase)
    }
    // async getAll() {
    //     try {
    //         const response = await fetch(`${this.apiUrl}hibridos`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error al obtener los hibridos: ${response.statusText}`);
    //         }
    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             console.log('exitooooo.');
    //             return { success: true, hibridos: data.hibridos };
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

    async getById(id) {
        try {
            const response = await fetch(`${this.apiUrl}hibridos/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('hibrido no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener la variedad: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, hibridos: data.hibridos };
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
    }
    async create(hibrido) {
        try {
            console.log("hibrido por agregar:", hibrido)
            const response = await fetch(`${this.apiUrl}hibridos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hibrido)
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`Error al crear el hibrido: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, hibrido: data.hibrido };
            } else {
                console.log('Error al crear el hibrido.');
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

    async update(cultivo, variedad,hibrido, hibridoObj) {
        try {
            console.log("Cultivo:", cultivo, "Variedad:", variedad,"Hibrido:",hibrido , "Datos a actualizar:", hibridoObj)
            const response = await fetch(`${this.apiUrl}hibridos/${cultivo}/${variedad}/${hibrido}`, {
                
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hibridoObj)
            });
            console.log(response)

            if (!response.ok) {
                throw new Error(`Error al actualizar el hibrido: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, hibridos: data.hibridos };
            } else {
                console.log('Error al actualizar el hibrido.');
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

    async delete(cultivo, variedad, hibrido){
        const url=`hibridos/${cultivo}/${variedad}/${hibrido}`;
        const dataName="hibrido"
        return super.delete(url,dataName)
    }
    // async delete(cultivo, variedad, hibrido) {
    //     try {
    //         console.log(cultivo, variedad,hibrido)
    //         const response = await fetch(`${this.apiUrl}hibridos/${cultivo}/${variedad}/${hibrido}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.status === 404) {
    //             throw new Error('hibrido no encontrado.');
    //         }

    //         if (!response.ok) {
    //             throw new Error(`Error al eliminar el hibrido: ${response.statusText}`);
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