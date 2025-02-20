import { server } from './global.js';
import { Service } from './Service.js'; 

export class LoteService extends Service{
    constructor() {
        super();
        this.apiUrl = server.url;
    }
    async getAll(){
        const url="Lotes";
        const data="lotes";
        return super.getAll(url,data,data)
    }
    // async getAll() {
    //     try {
    //         const response = await fetch(`${this.apiUrl}Lotes`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error al obtener los lostes: ${response.statusText}`);
    //         }
    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             console.log('exitooooo.');
    //             return { success: true, lotes: data.lotes };
    //         } else {
    //             console.log('No se encontraron lotes.');
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

    async getLotesActivos() {
        try {
            const response = await fetch(`${this.apiUrl}Lotes/activos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error al obtener los lotes activos: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                //console.log('exito.');
                return { success: true, lotes: data.lotesActivos };
            } else {
                console.log('No se encontraron lotes activos.');
                return { success: false, status: data.status };
            }

        }catch (error){
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message, error);
            }
        }
    }

    async getById(id) {
        try {
            const response = await fetch(`${this.apiUrl}Lotes/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Lote no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el lote: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, lotes: data.lostes };
            } else {
                console.log('Lote no encontrada.');
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
    async create(lote) {
        const url="Lotes"
        const dataName="lotes"
        return super.create(url,lote,dataName)
    }
   /* async create(lote) {
        try {
            console.log("lote por agregar:", lote)
            const response = await fetch(`${this.apiUrl}Lotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lote)
            });

            if (!response.ok) {
                throw new Error(`Error al crear el lote: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, lotes: data.lotes };
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
    }
*/

async update(id, lotes){
    const url=`Lotes/${id}`;
    const dataName="lotes"
    return super.update(url,lotes,dataName)
}
    // async update(id, lotes) {
    //     try {
    //         console.log("el ide: ",id,"el Lote: ",lotes)
    //         const response = await fetch(`${this.apiUrl}Lotes/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(lotes)
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error al actualizar el lote: ${response.statusText}`);
    //         }

    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             return { success: true, lotes: data.lotes };
    //         } else {
    //             console.log('Error al actualizar el lote.');
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
        const url=`Lotes/${id}`;
        const dataName="Lote"
        return super.delete(url,dataName)
    }
    // async delete(id) {
    //     try {
    //         console.log(id)
    //         const response = await fetch(`${this.apiUrl}Lotes/${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.status === 404) {
    //             throw new Error('Lote no encontrado.');
    //         }

    //         if (!response.ok) {
    //             throw new Error(`Error al eliminar el Lote: ${response.statusText}`);
    //         }

    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             return { success: true, message: data.message };
    //         } else {
    //             console.log('Error al eliminar el lote.');
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