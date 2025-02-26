import { server } from './global.js';
import { Service } from './Service.js'; 

export class DDTLaboresService extends Service {
    constructor() {
        super();
        this.apiUrl = server.url;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}DDTLabores`, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`Error al obtener labores: ${response.statusText}`);
            }
            const data = await response.json();
            return data.isSuccess && data.status === 200 ? { success: true, ddtLabores: data.DDTLabores } : { success: false, status: data.status };
        } catch (error) {
            throw new Error(error.message.includes('Failed to fetch') ? 'No se pudo conectar al servidor. Verifica si el backend está corriendo.' : error.message);
        }
    }

    async getByAliasLabor(aliasLabor) {
        try {
            const response = await fetch(`${this.apiUrl}DDTLabores/alias/${aliasLabor}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
    
            // Verificamos si la respuesta es 404
            if (response.status === 404) {
                throw new Error('No se encontraron registros con ese alias.');
            }
    
            // Si la respuesta no es correcta, lanzamos un error
            if (!response.ok) {
                throw new Error(`Error al obtener el registro: ${response.statusText}`);
            }
    
            // Intentamos parsear los datos JSON
            const data = await response.json();
    
            // Mostrar el contenido de la respuesta para verificar
            console.log('Respuesta del servidor:', data);
    
            // Verificamos el formato de la respuesta antes de retornar
            if (data.isSuccess && data.status === 200) {
                return { success: true, ddtLabores: data.ddtLabores };
            } else {
                return { success: false, status: data.status };
            }
        } catch (error) {
            // Si hay un error, lo mostramos en la consola
            console.error('Error:', error.message);
            throw new Error(error.message.includes('Failed to fetch') ? 'No se pudo conectar al servidor. Verifica si el backend está corriendo.' : error.message);
        }
    }
    

    async getByDepartamentoLaborAlias(departamento, labor, aliasLabor) {  
        try {  
            const response = await fetch(`${this.apiUrl}DDTLabores/departamento/${departamento}/labor/${labor}/alias/${aliasLabor}`, {  
                method: 'GET',  
                headers: { 'Content-Type': 'application/json' }  
            });  
    
            if (response.status === 404) {  
                throw new Error('No se encontraron registros con esos parámetros.');  
            }  
            if (!response.ok) {  
                throw new Error(`Error al obtener los registros: ${response.statusText}`);  
            }  
            
            const data = await response.json();  
            return data.isSuccess && data.status === 200   
            ? { success: true, ddtLabores: data.DDTLabores || data.ddtLabores }  
            : { success: false, status: data.status };

        } catch (error) {  
            throw new Error(error.message.includes('Failed to fetch')  
                ? 'No se pudo conectar al servidor. Verifica si el backend está corriendo.'  
                : error.message);  
        }  
    }
    

    async create(ddtLabor) {  
        try {  
            const response = await fetch(`${this.apiUrl}DDTLabores`, {  
                method: 'POST',  
                headers: { 'Content-Type': 'application/json' },  
                body: JSON.stringify(ddtLabor)  
            });  
    
            if (!response.ok) {  
                const errorData = await response.json(); 
                throw new Error(errorData.message || `Error al crear el Labor: ${response.statusText}`);  
            }  
            
            const data = await response.json();  
            return data.isSuccess && data.status === 201 ? { success: true, ddtLabor: data.DDTLabor } : { success: false, status: data.status };  
            
        } catch (error) {  
            if (error.response) {  
                console.error("Error en la respuesta del servidor:", error.response.data);  
            } else if (error.request) {  
                console.error("No hubo respuesta del servidor:", error.request);  
            } else {  
                console.error("Error en la configuración de la solicitud:", error.message);  
            }  
            throw new Error(error.message.includes('Failed to fetch') ? 'No se pudo conectar al servidor. Verifica si el backend está corriendo.' : error.message);  
        }  
    }

    async update(temporada, departamento, siembraNumero, labor, aliasLabor, ddt, laborData) {  
        try {  
            const url = `${this.apiUrl}DDTLabores/${temporada}/${departamento}/${siembraNumero}/${labor}/${aliasLabor}/${ddt}`;
            
            console.log("🔹 URL de la solicitud:", url);
            console.log("📦 Datos enviados en el body:", JSON.stringify(laborData, null, 2));
    
            const response = await fetch(url, {  
                method: 'PUT',  
                headers: { 'Content-Type': 'application/json' },  
                body: JSON.stringify(laborData)  
            });  
    
            if (!response.ok) {  
                const errorData = await response.json();  
                throw new Error(errorData.message || `Error al actualizar el Labor: ${response.statusText}`);  
            }  
    
            const data = await response.json();  
    
            return data.isSuccess && data.status === 200  
                ? { success: true, ddtLabor: data.DDTLabor, message: data.message || "Actualización exitosa." }  
                : { success: false, status: data.status, message: data.message || "Error en la actualización." };
    
        } catch (error) {  
            if (error.response) {  
                console.error("Error en la respuesta del servidor:", error.response.data);  
            } else if (error.request) {  
                console.error("No hubo respuesta del servidor:", error.request);  
            } else {  
                console.error("Error en la configuración de la solicitud:", error.message);  
            }  
            
            throw new Error(error.message.includes('Failed to fetch')   
                ? 'No se pudo conectar al servidor. Verifica si el backend está corriendo.'   
                : error.message);  
        }  
    }
    
    

    async delete(temporada, departamento, siembraNumero, labor, aliasLabor, ddt) {
        try {
            const response = await fetch(`${this.apiUrl}DDTLabores/${temporada}/${departamento}/${siembraNumero}/${labor}/${aliasLabor}/${ddt}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.status === 404) {
                throw new Error('DDLabor no encontrada.');
            }
            if (!response.ok) {
                throw new Error(`Error al eliminar el DDTLabor: ${response.statusText}`);
            }
    
            const data = await response.json();
            return data.isSuccess && data.status === 200 
                ? { success: true, message: data.message } 
                : { success: false, status: data.status };
        } catch (error) {
            throw new Error(error.message.includes('Failed to fetch') 
                ? 'No se pudo conectar al servidor. Verifica si el backend está corriendo.' 
                : error.message);
        }
    }
   
}
