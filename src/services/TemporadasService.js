import { server } from './global.js';

export class TemporadasService {

    constructor() {
        this.apiUrl = server.url;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}temporadas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error al obtener las temporadas: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, temporadas: data.temporadas };
            } else {
                console.log('No se encontraron temporadas.');
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
            const response = await fetch(`${this.apiUrl}temporadas/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Temporada no encontrada.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener la Temporada: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, temporadas: data.temporadas };
            } else {
                console.log('Temporada no encontrada.');
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

    async create(temporada) {
        try {
            console.log("temporada por agregar:", temporada)
            const response = await fetch(`${this.apiUrl}temporadas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(temporada)
            });

            if (!response.ok) {
                throw new Error(`Error al crear la temporada: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, temporadas: data.temporadas };
            } else {
                console.log('Error al crear la temporada.');
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

    async update(id, temporadas) {
        try {
            const response = await fetch(`${this.apiUrl}temporadas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(temporadas)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar la temporada: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, temporadas: data.temporadas };
            } else {
                console.log('Error al actualizarla temporada.');
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
            const response = await fetch(`${this.apiUrl}temporadas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Temporada no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al eliminar la temporada: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, message: data.message };
            } else {
                console.log('Error al eliminar la temporada.');
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