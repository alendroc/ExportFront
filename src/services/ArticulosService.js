import {server} from './global.js'

export class ArticulosService {
    constructor() {
        this.apiUrl = server.url;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}articulos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error al obtener los articulos: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                console.log('exitooooo.');
                return { success: true, articulos: data.articulos };
            } else {
                console.log('No se encontraron articulos.');
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
                console.log('Articulo no encontrada.');
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

    async create(articulo) {
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
    }
    async update(id, articulos) {
        try {
            console.log("el ide: ",id,"el articulo: ",articulos)
            const response = await fetch(`${this.apiUrl}articulos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articulos)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el articulo: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, articulos: data.articulos };
            } else {
                console.log('Error al actualizar el articulo.');
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
            const response = await fetch(`${this.apiUrl}articulos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Lote no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al eliminar el articulo: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, message: data.message };
            } else {
                console.log('Error al eliminar el larticulo.');
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
