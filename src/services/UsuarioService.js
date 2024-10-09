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
            throw error('En el backend: ',error);
        }
    }
}