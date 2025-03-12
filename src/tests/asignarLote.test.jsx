import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LotePOService } from '../services/LotesPOService';

describe('LotePOService.getAll', () => {
  
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe retornar success true cuando la API responde exitosamente', async () => {
    
    const mockResponse = {
      isSuccess: true,
      status: 200,
      lotesPO: [
        { Temporada: '2025-2026', SiembraNum: 1, NombreLote: 'Lote de prueba', AliasLote: 'Lote 1' }
      ]
    };

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

describe("LotePOService.create", () => {
  let service;

  beforeEach(() => {
    service = new LotePOService();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debe agregar un nuevo registro a LotesPO y retornar éxito", async () => {
    
    const mockResponse = {
      isSuccess: true,
      status: 201,
      lotePO: { Temporada: '2025-2026', SiembraNum: 1, NombreLote: 'Lote de prueba', AliasLote: 'Lote 1' },
      message: "LotePO creado con éxito.",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const nuevoLote = { Temporada: '2025-2026', SiembraNum: 1, NombreLote: 'Lote de prueba', AliasLote: 'Lote 1' };

    const response = await service.create(nuevoLote);

    
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:7220/api/v2/LotesPO",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoLote),
      })
    );

    console.log("Respuesta de la API:", response);
    
    expect(response.success).toBe(true);
    expect(response.status).toBe(201);
    expect(response.lotePO).toEqual(mockResponse.lotePO);
    expect(response.message).toEqual("LotePO creado con éxito.");
  });
});

describe("LotePOService.delete", () => {
  let service;

  beforeEach(() => {
    service = new LotePOService();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debe eliminar un registro de LotesPO y retornar éxito", async () => {
    
    const mockResponse = {
      isSuccess: true,
      status: 200,
      message: "LotePO eliminado exitosamente.",
    };

    
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    
    const response = await service.delete('2025-2026', 1, 'Lote de prueba', 'Lote 1');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:7220/api/v2/LotesPO/2025-2026/1/Lote de prueba/Lote 1',
      expect.objectContaining({
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
    );
    
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.message).toEqual("LotePO eliminado exitosamente.");
  });
});

describe("LotePOService.update", () => {
  let service;

  beforeEach(() => {
    service = new LotePOService();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const loteUpdate = { Temporada: '2025-2026', SiembraNum: 1, NombreLote: 'Lote de prueba', AliasLote: 'Lote 1', FechaTrasplante: '2025-03-12' };

  it("debe actualizar un registro de LotesPO y retornar éxito", async () => {
    
    const mockResponse = {
      isSuccess: true,
      status: 200,
      lotePO: { Temporada: '2025-2026', SiembraNum: 1, NombreLote: 'Lote de prueba', AliasLote: 'Lote 1', FechaTrasplante: '2025-03-12' },
      message: "LotePO actualizado exitosamente.",
    };

    
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    
    const response = await service.update('2025-2026', 1, 'Lote de prueba', 'Lote 1', loteUpdate);

    
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:7220/api/v2/LotesPO/2025-2026/1/Lote de prueba/Lote 1',
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loteUpdate)
      })
    );
    
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.message).toEqual("LotePO actualizado exitosamente.");
    expect(response.lotePO).toEqual(mockResponse.lotePO);
  });
});