import { server } from './global.js';

export class LotePOService{
    constructor() {
        this.apiUrl = server.url;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.apiUrl}LotesPO`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error al obtener los lotesPO: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                console.log('exitooooo.');
                return { success: true, LotesPO: data.LotesPO };
            } else {
                console.log('No se encontraron lotes.');
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
            const response = await fetch(`${this.apiUrl}LotesPO/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('LotePO no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al obtener el lotePO: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, LotesPO: data.LotesPO };
            } else {
                console.log('LotePO no encontrado.');
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

    async create(lotePo) {
        try {
            console.log("lote por agregar:", lotePo)
            const response = await fetch(`${this.apiUrl}LotesPO`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lotePo)
            });

            if (!response.ok) {
                throw new Error(`Error al crear el lotePO: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 201) {
                return { success: true, LotePO: data.LotePO };
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

    async update(temporada, siembraNum, nombreLote, aliasLote, lotePO) {
        try {
            console.log("temporada:", temporada, "siembraNum:", siembraNum,"nombreLote:",nombreLote ,
                "aliasLote:",aliasLote, "Datos a actualizar:", lotePO)

            const response = await fetch(`${this.apiUrl}LotesPO/${temporada}/${siembraNum}/${nombreLote}/${aliasLote}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lotePO)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el lotePO: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, LotePO: data.LotePO };
            } else {
                console.log('Error al actualizar el lotePO.');
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

    async delete(temporada, siembraNum, nombreLote, aliasLote, lotePO) {
        try {
            console.log("temporada:", temporada, "siembraNum:", siembraNum,"nombreLote:",nombreLote ,
                "aliasLote:",aliasLote, "Datos a actualizar:", lotePO)

            const response = await fetch(`${this.apiUrl}Lotes/${temporada}/${siembraNum}/${nombreLote}/${aliasLote}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                throw new Error('Lote no encontrado.');
            }

            if (!response.ok) {
                throw new Error(`Error al eliminar el Lote: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.isSuccess && data.status === 200) {
                return { success: true, message: data.message };
            } else {
                console.log('Error al eliminar el lote.');
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