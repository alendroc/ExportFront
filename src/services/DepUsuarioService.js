import { server } from './global.js';  
import { Service } from './Service.js'; 

export class DepUsuarioService extends Service{  
    constructor() {  
        super();
        this.apiUrl = `${server.url}depusuarios/`;  
    }  

    // Crear una nueva relación de DepUsuario  
    async store(usuario, departamentos) {  
        if (!usuario || !departamentos || departamentos.length === 0) {  
            throw new Error('Datos inválidos. Usuario o departamentos no proporcionados.');  
        }  

        try {  
            const response = await fetch(this.apiUrl, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json'  
                },  
                body: JSON.stringify({ usuario, departamentos })  
            });  

            if (!response.ok) {  
                const errorData = await response.json();  
                throw new Error(`Error al crear la relación: ${errorData.message || response.statusText}`);  
            }  

            const data = await response.json();  

            if (data.isSuccess && data.status === 201) {  
                return { success: true, mensaje: 'Relación creada exitosamente.' };  
            } else {  
                return { success: false, status: data.status };  
            }  
        } catch (error) {  
            this.handleFetchErrors(error);  
        }  
    }  

    // Eliminar una relación de DepUsuario  
    async destroy(usuario, departamentos) {  
        if (!usuario || !departamentos || departamentos.length === 0) {  
            throw new Error('Datos inválidos. Usuario o departamentos no proporcionados.');  
        }  

        try {  
            const response = await fetch(`${this.apiUrl}destroy`, {  
                method: 'DELETE',  
                headers: {  
                    'Content-Type': 'application/json'  
                },  
                body: JSON.stringify({ usuario, departamentos })  
            });  

            if (!response.ok) {  
                const errorData = await response.json();  
                throw new Error(`Error al eliminar la relación: ${errorData.message || response.statusText}`);  
            }  

            const data = await response.json();  

            if (data.isSuccess && data.status === 200) {  
                return { success: true, mensaje: 'Relación eliminada exitosamente.' };  
            } else {  
                return { success: false, status: data.status };  
            }  
        } catch (error) {  
            this.handleFetchErrors(error);  
        }  
    }  

    // Actualizar una relación de DepUsuario  
    async update(usuario, departamentos) {  
        if (!usuario || !departamentos || departamentos.length === 0) {  
            throw new Error('Datos inválidos. Usuario o departamentos no proporcionados.');  
        }  

        try {  
            const response = await fetch(`${this.apiUrl}update`, {  
                method: 'PUT',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({ usuario, departamentos }),  
            });  

            if (!response.ok) {  
                const errorData = await response.text();  
                const message = errorData ? JSON.parse(errorData).message : 'Error sin respuesta del servidor';  
                throw new Error(`Error al actualizar la relación: ${message || response.statusText}`);  
            }  

            const data = await response.json();  

            if (data.isSuccess && data.status === 200) {  
                return { success: true, mensaje: 'Relación actualizada exitosamente.' };  
            } else {  
                return { success: false, status: data.status };  
            }  
        } catch (error) {  
            this.handleFetchErrors(error);  
        }  
    }  


    async getByUsuario(usuario) {
        if (!usuario) {
            throw new Error("Usuario no proporcionado.");
        }
    
        try {
            const response = await fetch(`${this.apiUrl}${usuario}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al obtener departamentos: ${errorData.message || response.statusText}`);
            }
    
            const data = await response.json();
    
            if (data.isSuccess && data.status === 200) {
                return { success: true, departamentos: data.departamentos };
            } else {
                return { success: false, status: data.status, departamentos: [] };
            }
        } catch (error) {
            this.handleFetchErrors(error);
        }
    }
    

    // Método auxiliar para manejar errores al hacer fetch  
    handleFetchErrors(error) {  
        if (error.message.includes('Failed to fetch')) {  
            throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');  
        } else {  
            throw new Error(error.message);  
        }  
    }  
}