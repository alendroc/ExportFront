import {server} from './global.js'

export class UsuarioService {

    constructor() {
        this.apiUrl = server.url;
    }

    async login(user) {
        try {
            const respuesta = await fetch(`${this.apiUrl}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (respuesta.status === 401) {
                throw new Error('Ingreso fallido, credenciales incorrectas o usuario no encontrado.');
            }

            if (!respuesta.ok) {
                throw new Error(`En el inicio de sesión: ${respuesta.statusText}`);
            }

            const data = await respuesta.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, user: data.user };
            } else {
                console.log('Login fallido, credenciales incorrectas o usuario no encontrado.');
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


    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}usuarios`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
            }
    
            const data = await response.json();
            if (data.isSuccess && data.status === 200) {
                return { success: true, usuarios: data.usuarios };
            } else {
                console.warn('No se encontraron usuarios.', data.message);
                return { success: false, status: data.status };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else if (error.name === 'TypeError') {
                throw new Error('Hubo un problema al procesar la respuesta del servidor. Verifica el formato de la respuesta.');
            } else {
                throw new Error(`Error inesperado: ${error.message}`);
            }
        }
    }
    
    
    
    

    // Obtener un usuario por ID
    async getById(id) {
        try {
            const response = await fetch(`${this.apiUrl}usuarios/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Usuario no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el usuario: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, usuario: data.usuario };
            } else {
                console.log('Usuario no encontrado.');
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

    // Crear un nuevo usuario
    async create(usuario) {
        try {
            const response = await fetch(`${this.apiUrl}usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error devuelto por la API:", errorData); // Agrega esta línea
                throw new Error(`Error al crear el usuario: ${errorData.message || response.statusText}`);
            }
            

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, usuario: data.usuario };
            } else {
                return { success: false, status: data.status || 400 };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message);
            }
        }
    }

    // Actualizar un usuario por ID
    async update(id, usuario) {
        try {
            const response = await fetch(`${this.apiUrl}usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el usuario: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, usuario: data.usuario };
            } else {
                return { success: false, status: data.status };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message);
            }
        }
    }

    // Eliminar un usuario por ID

    async delete(id) {
        if (!id) {
            throw new Error('ID del usuario no proporcionado.');
        }

        try {
            const response = await fetch(`${this.apiUrl}usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Usuario no encontrado.');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al eliminar el usuario: ${errorData.message || response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, message: data.message };
            } else {
                console.log('Error al eliminar el usuario.');
                return { success: false, status: data.status };
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message);
            }
        }
    }

    
}