import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ArticulosService } from '../services/ArticulosService';

describe('ArticulosService.getAll', () => {
  // Antes de cada test, creamos un mock de fetch
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  // Después de cada test, restauramos el estado original
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe retornar success true cuando la API responde exitosamente', async () => {
    // Simulamos la respuesta de la API
    const mockResponse = {
      isSuccess: true,
      status: 200,
      articulos: [
        { idArticulo: 'ABCD-12-34-56-78', nombreArticulo: 'Articulo de prueba' }
      ]
    };

    // Configuramos el mock de fetch para que retorne una respuesta exitosa
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const articulosService = new ArticulosService();
    const response = await articulosService.getAll();

    expect(response.success).toBe(true);
    expect(response.articulos).toEqual(mockResponse.articulos);
  });
});