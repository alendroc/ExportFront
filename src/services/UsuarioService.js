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

            if (!respuesta.ok) {
                throw new Error(`Error en el inicio de sesión: ${respuesta.statusText}`);
            }

            const data = await respuesta.json();

            if (data.isSuccess && data.status === 200) {
                console.log('Login exitoso, usuario encontrado:', data.user);
                return { success: true, user: data.user };
            } else {
                console.log('Login fallido, credenciales incorrectas o usuario no encontrado.');
                return { success: false, status: data.status };
            }
            
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }
}