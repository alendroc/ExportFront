import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProductosLaborPoService } from '../services/ProductosLaborPOService';
import { ProductoService } from '../services/ProductoService';

describe('Productos.getIdNameType', () => {
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
      productos: [
        { idProducto: 1, nombreDescriptivo: 'Producto 1', tipoUso: 'Fertilizante' },
        { idProducto: 2, nombreDescriptivo: 'Producto 2', tipoUso: 'Herbicida' },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const service = new ProductoService();
    const response = await service.getIdNameType();

    expect(response.success).toBe(true);
    expect(response.productos).toEqual(mockResponse.productos);
  });
});

describe('ProductosLaborPoService.create', () => {
  let service;

  beforeEach(() => {
    service = new ProductosLaborPoService();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe asignar un producto correctamente y retornar éxito', async () => {
    const mockResponse = {
      isSuccess: true,
      status: 201,
      producto: { idProducto: 1, nombreDescriptivo: 'Producto 1', tipoUso: 'Fertilizante' },
      message: 'poProductosLabor creado con éxito.',
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const nuevoProducto = { idProducto: 1, dosisHa: 10, horasAgua: 5, horasInyeccion: 2, horasLavado: 1 };

    const response = await service.create(nuevoProducto);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:7220/api/v2/PoProductosLabor',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      })
    );

    expect(response.success).toBe(true);
    expect(response.status).toBe(201);
    expect(response.message).toEqual('poProductosLabor creado con éxito.');
  });
});

