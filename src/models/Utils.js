export class Utils
{
    //cargar datos de los services
    static async fetchData(service, setDta, logName) {
        try {
          const response = await service;
          if (response.success) {
            if (typeof setDta === 'function') {
              setDta(response[logName]);
            }
       
            return response[logName];
          } else {
            console.log(`No se pudieron obtener los ${logName}.`);
            return null;
          }
        } catch (error) {
          if (typeof setDta === 'function') {
            setDta([]);
          }
          console.error(`Error al obtener los ${logName}:`, error);
          return null;
        }
      }
}