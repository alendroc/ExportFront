import { Service } from './Service.js'; 

export class LaboresService extends Service{
    constructor() {
        super();
    }
    async getAll(){
        const subclase="labores"
        return super.getAll(subclase,subclase,subclase)
    }
    // async getAll() {
    //     try {
    //         const response = await fetch(`${this.apiUrl}labores`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error al obtener los labores: ${response.statusText}`);
    //         }
    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             console.log('exitooooo.');
    //             return { success: true, labores: data.labores };
    //         } else {
    //             console.log('No se encontraron labores.');
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

    async getById(labor, departamento) {
        try {
            const response = await fetch(`${this.getApiUrl()}labores/${labor}/${departamento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Labor no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el labor: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, labores: data.labores };
            } else {
                console.log('Labor no encontrado.');
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
    
    async create(labor) {
        const url="labores",
        dataName="labores"
        return super.create(url,labor,dataName)
    }
    /*async create(labor) {
        try {
            console.log("Labor por agregar:", labor)
            const response = await fetch(`${this.apiUrl}labores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(labor)
            });

            if (!response.ok) {
                throw new Error(`Error al crear el labor: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, labores: data.labores };
            } else {
                console.log('Error al crear el labor.');
                return { success: false, status: data.status };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                console.log(error);
                throw new Error(error.message, error);  
            }
        }
    }*/

        //NO PARECE COMPATIBLE

    async update(id, departamento, labor){
        const url=`labores/${id}/${departamento}`;
        const dataName="labor"
        return super.update(url,labor,dataName)
    }
    /*async update(id, departamento, labor) {
        try {
            console.log("el labor: ",id)
            const response = await fetch(`${this.apiUrl}labores/${id}/${departamento}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(labor),
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el labor: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, labores: data.labores };
            } else {
                console.log('Error al actualizar el labor.');
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

    async delete(id, departamento){
        const url=`labores/${id}/${departamento}`;
        const dataName="labor"
        return super.delete(url,dataName)
    }
    // async delete(id, departamento) {
    //     try {
    //         console.log(id)
    //         const response = await fetch(`${this.apiUrl}labores/${id}/${departamento}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.status === 404) {
    //             throw new Error('Labor no encontrado.');
    //         }

    //         if (!response.ok) {
    //             throw new Error(`Error al eliminar el labor: ${response.statusText}`);
    //         }

    //         const data = await response.json();

    //         if (data.isSuccess && data.status === 200) {
    //             return { success: true, message: data.message };
    //         } else {
    //             console.log('Error al eliminar el labor.');
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