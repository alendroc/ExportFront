import { server } from './global.js';

export class LaboresTService{
    constructor() {
        this.apiUrl = server.url;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}LaboresT`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error al obtener los LaboresT: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                //console.log('exitooooo.');
                //console.log("data", data)
                return { success: true, LotesPO: data.lotesPO };
            } else {
                console.log('No se encontraron labores.');
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

    async getByDepartamento(temporada, departamento, labor) {
       
        try {
            const response = await fetch(`${this.apiUrl}LaboresT/${temporada}/${departamento}/${labor}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Labores no encontrados.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el labor: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("response",data)

            if (data.isSuccess && data.status === 200) {
                return { success: true, LotesPO: data.lotesPO };
            } else {
                console.log('LaboresT no encontrado.');
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

        async create(LaborT) {
            try {
                console.log("Labor por agregar:", LaborT)
                const response = await fetch(`${this.apiUrl}LaboresT`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(LaborT)
                });
    
                if (!response.ok) {
                    throw new Error(`Error al crear el Labor: ${response.statusText}`);
                }
    
                const data = await response.json();
    
                if (data.isSuccess && data.status === 201) {
                    return { success: true, LaborT: data.LaborT };
                } else {
                    console.log('Error al crear el Labor.');
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

        async update(departamento, labor, laborT) {
            try {
                console.log("Datos a actualizar:", laborT)
    
                const response = await fetch(`${this.apiUrl}LaboresT/${departamento}/${labor}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(laborT)
                });
    
                if (!response.ok) {
                    throw new Error(`Error al actualizar el laborT: ${response.statusText}`);
                }
    
                const data = await response.json();
    
                if (data.isSuccess && data.status === 200) {
                    return { success: true, LotePO: data.LotePO };
                } else {
                    console.log('Error al actualizar el laborT.');
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
        async delete(departamento, labor,) {
            try {
    
                const response = await fetch(`${this.apiUrl}LaboresT/${departamento}/${labor}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                if (response.status === 404) {
                    throw new Error('Labor no encontrado.');
                }
    
                if (!response.ok) {
                    throw new Error(`Error al eliminar el Labor: ${response.statusText}`);
                }
    
                const data = await response.json();
    
                if (data.isSuccess && data.status === 200) {
                    return { success: true, message: data.message };
                } else {
                    console.log('Error al eliminar el Labor.');
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
}