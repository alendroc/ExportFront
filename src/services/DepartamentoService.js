import { server } from './global.js';

export class DepartamentoService{
    constructor() {
        this.apiUrl = server.url;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}Departamentos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error al obtener los departamentos: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Datos recibidos del servidor:", data); // Verificar contenido de 'data'
    
            if (data.isSuccess && data.status === 200) {
                console.log("Departamentos recibidos:", data.departamentos); // Acceder a 'departamentos' con minúscula
                return { success: true, departamentos: data.departamentos };
            } else {
                console.log("Error en la respuesta:", data.status, data.isSuccess);
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


    



    async getById(id) {
        try {
            const response = await fetch(`${this.apiUrl}Departamentos/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Departamento no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el departamento: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, departamentos: data.departamentos };
            } else {
                console.log('Departamento no encontrado.');
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

    async create(departamento) {
        try {
            console.log("Departamento por agregar:", departamento)
            const response = await fetch(`${this.apiUrl}Departamentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(departamento)
            });

            if (!response.ok) {
                throw new Error(`Error al crear el departamento: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, departamentos: data.departamentos };
            } else {
                console.log('Error al crear el departamento.');
                return { success: false, status: data.status };
            }
        } catch (error) {
            //console.log(error.message)
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message, error);
            }
        }
    }

    async update(id, departamentos) {
        try {
            console.log("el ide: ",id,"el departamento: ",departamentos)
            const response = await fetch(`${this.apiUrl}Departamentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(departamentos)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el departamento: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, departamentos: data.departamentos };
            } else {
                console.log('Error al actualizar el departamento.');
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

    async delete(id) {
        try {
            console.log(id)
            const response = await fetch(`${this.apiUrl}Departamentos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Departamento no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al eliminar el departamento: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, message: data.message };
            } else {
                console.log('Error al eliminar el departamento.');
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