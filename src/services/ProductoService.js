import { server } from './global.js';

export class ProductoService {
    
    constructor() {
        this.apiUrl = server.url;
    }

    // Obtener lista de productos
    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}productos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener los productos: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, productos: data.productos };
            } else {
                console.log('No se encontraron productos.');
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

    // Obtener un producto por ID
    async getById(id) {
        try {
            const response = await fetch(`${this.apiUrl}productos/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el producto: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, producto: data.producto };
            } else {
                console.log('Producto no encontrado.');
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

    // Crear un nuevo producto
    async create(producto) {
        try {
            const response = await fetch(`${this.apiUrl}productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                throw new Error(`Error al crear el producto: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, producto: data.producto };
            } else {
                console.log('Error al crear el producto.');
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

    // Actualizar un producto por ID
    async update(id, producto) {
        try {
            const response = await fetch(`${this.apiUrl}productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el producto: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, producto: data.producto };
            } else {
                console.log('Error al actualizar el producto.');
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

    // Eliminar un producto por ID
    async delete(id) {
        try {
            const response = await fetch(`${this.apiUrl}productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, message: data.message };
            } else {
                console.log('Error al eliminar el producto.');
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