import { server } from './global.js';

export class Service{

    constructor() {
        this.apiUrl = server.url;
    }

    async getAll(url, dataName,dataResponse) {
        try {
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

            if (data.isSuccess && data.status === 200) {
                //console.log('exitooooo.');
                //console.log("data", data)
                return { success: true, [dataName]: data[dataResponse] };
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


    
}