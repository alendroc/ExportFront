import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LotePOService } from '../services/LotesPOService';

describe('LotePOService', () => {
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
      lotesPO: [
        { Temporada: '2025-2026', SiembraNum: 1, NombreLote: 'Lote de prueba', AliasLote: 'Lote 1' }
      ]
    };

    // Configuramos el mock de fetch para que retorne una respuesta exitosa
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const lotePOService = new LotePOService();
    const response = await lotePOService.getAll();

    expect(response.success).toBe(true);
    expect(response.lotesPO).toEqual(mockResponse.lotesPO);
  });
});