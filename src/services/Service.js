import { server } from './global.js';

export class Service{

    constructor() {
        this.apiUrl = server.url;
    }

    getApiUrl(){
        return this.apiUrl;
    }

    async getAll(url, dataName,dataResponse) {
        try {
            console.log("URL de la petición:", `${this.apiUrl}${url}`);
            const response = await fetch(`${this.apiUrl}${url}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error al obtener los ${dataResponse}: ${response.statusText}`);
            }
            const data = await response.json();
            //console.log("Respuesta de la API:", data);  

            if (data.isSuccess && data.status === 200) {
                //console.log('exitooooo.');
                //console.log("data", data)
                return { success: true, [dataName]: data[dataResponse]};
            } else {
                console.log(`No se encontraron ${dataResponse}.`);
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

    async create(url,contenido,dataName) {
        try {
            
            const response = await fetch(`${this.apiUrl}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contenido)
                
            });
            const data = await response.json();
            console.log(data)

         
            if (!response.ok) {
                if(data.innerError.includes("Cannot insert duplicate key in object"))
                    throw new Error("Ya existe un registro con este ID");
                throw new Error(`Error al crear el ${dataName}: ${response.statusText}`);
            }

            if (data.isSuccess && data.status === 201) {
                return { success: true, status: data.status, [dataName]: data[dataName], message: data.message };
            } else {
                //console.log('Error al crear el ', dataName);
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




    async update(url, contenido,dataName) {  
        try {  
            const response = await fetch(`${this.apiUrl}${url}`, {  
                method: 'PUT',  
                headers: {  
                    'Content-Type': 'application/json'  
                },  
                body: JSON.stringify(contenido)  
            });  

            if (!response.ok) {  
                throw new Error(`Error al actualizar la ${dataName}: ${response.statusText}`);  
            }  

            const data = await response.json();  

            if (data.isSuccess && data.status === 200) {  
                return { success: true, status: data.status, [dataName]: data[dataName], message: data.message };  
            } else {  
                console.log(`Error al actualizar la ${dataName}.`);  
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


    async delete(url,dataName) {
        try {
            const response = await fetch(`${this.apiUrl}${url}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error(`${dataName} no encontrado.`);
            }
            const data = await response.json();

            if (!response.ok) {
                //console.log("error",data)
                if(data.innerError.includes("conflicted with the REFERENCE constraint"))
                    throw new Error("Elementos en uso");
                throw new Error(`Error al eliminar el ${dataName}: ${response.statusText}`);
            }


            if (data.isSuccess && data.status === 200) {
                return { success: true, status: data.status, message: data.message };
            } else {
                console.log(`Error al eliminar el ${dataName}.`);
                return { success: false, status: data.status };
            }
        } catch (error) { 
            console.log("error",error)

            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar al servidor. Verifica si el backend está corriendo.');
            } else {
                throw new Error(error.message, error);
            }
        }
    }

    async copiar(url,contenido,dataName) {
        try {
            console.log("elemento por copiar:", contenido)
            const response = await fetch(`${this.apiUrl}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contenido)
            });

            const data = await response.json();

            if (!response.ok) {
                if(data.innerError.includes("Cannot insert duplicate key"))
                    throw new Error(`Ya existe un ${dataName} con esos datos, no se puede duplicar.`);
                
                throw new Error(`Error al crear la copia: ${data.statusText}`);
            }


            if (data.isSuccess && data.status === 201) {
                return { success: true,[dataName]: data[dataName] };
            } else {
                console.log('Error al crear la copia-.');
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