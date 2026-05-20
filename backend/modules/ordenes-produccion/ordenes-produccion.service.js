import prisma from "../../utils/prisma.js";

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseBigIntId = (value, fieldName = "id") => {
  if (typeof value === "bigint") return value;
  try {
    return BigInt(value);
  } catch {
    throw createHttpError(400, `${fieldName} inválido`);
  }
};

const ESTADOS_VALIDOS = ["pendiente", "en_produccion", "completada", "cancelada"];

const TRANSICIONES_PERMITIDAS = {
  pendiente:     ["en_produccion", "cancelada"],
  en_produccion: ["completada", "cancelada"],
  completada:    [],
  cancelada:     [],
};

// ✅ CORREGIDO: Usar los nombres exactos del schema
const includeProducto = {
  productos: {
    select: { id: true, nombre: true, unidad_medida: true, costo_estimado: true },
  },
  usuarios: {  // ← Cambiado: 'usuarios' en lugar del nombre largo
    select: { id: true, nombre_completo: true },
  },
};

// ── GET ALL ──────────────────────────────────────────────
export const getOrdenes = async (filtros = {}) => {
  const where = {};

  if (filtros.estado && ESTADOS_VALIDOS.includes(filtros.estado)) {
    where.estado = filtros.estado;
  }

  if (filtros.producto_id) {
    where.producto_id = parseBigIntId(filtros.producto_id, "producto_id");
  }

  const ordenes = await prisma.ordenes_produccion.findMany({
    where,
    include: includeProducto,
    orderBy: { fecha_creacion: "desc" },
  });

  // Transformar para el frontend
  return ordenes.map(orden => ({
    id: Number(orden.id),
    producto_id: Number(orden.producto_id),
    producto_nombre: orden.productos?.nombre,
    cantidad_planeada: orden.cantidad_solicitada,
    cantidad_producida: 0,
    cantidad_entregada: 0,
    estado: orden.estado,
    fecha_inicio: orden.fecha_creacion,
    fecha_fin_estimada: orden.fecha_requerida,
    prioridad: "media",
    observaciones: orden.observaciones,
    created_at: orden.fecha_creacion,
    updated_at: orden.fecha_creacion,
    created_by: Number(orden.usuario_creador_id),
    creador_nombre: orden.usuarios?.nombre_completo,
    notificado_bodega: orden.notificado_bodega,
    fecha_cancelacion: orden.fecha_cancelacion,
    cantidad_solicitada: orden.cantidad_solicitada,
    fecha_requerida: orden.fecha_requerida
  }));
};

// ── GET HISTORIAL (completadas + canceladas) ─────────────
export const getHistorial = async () => {
  const ordenes = await prisma.ordenes_produccion.findMany({
    where: { estado: { in: ["completada", "cancelada"] } },
    include: includeProducto,
    orderBy: { fecha_creacion: "desc" },
  });

  return ordenes.map(orden => ({
    id: Number(orden.id),
    producto_id: Number(orden.producto_id),
    producto_nombre: orden.productos?.nombre,
    cantidad_planeada: orden.cantidad_solicitada,
    estado: orden.estado,
    fecha_creacion: orden.fecha_creacion,
    fecha_fin_estimada: orden.fecha_requerida,
    creador_nombre: orden.usuarios?.nombre_completo,
    fecha_cancelacion: orden.fecha_cancelacion,
    observaciones: orden.observaciones
  }));
};

// ── GET BY ID ────────────────────────────────────────────
export const getOrdenById = async (id) => {
  const ordenId = parseBigIntId(id, "orden_id");

  const orden = await prisma.ordenes_produccion.findUnique({
    where: { id: ordenId },
    include: {
      productos: {
        select: { id: true, nombre: true, unidad_medida: true, costo_estimado: true, descripcion: true },
      },
      usuarios: {  // ← Cambiado
        select: { id: true, nombre_completo: true, email: true },
      },
      registro_produccion: {
        include: {
          usuarios: {  // ← Cambiado: la relación en registro_produccion también se llama 'usuarios'
            select: { id: true, nombre_completo: true },
          },
        },
        orderBy: { created_at: "desc" },
      },
      entregas_producto: {
        include: {
          usuarios: {  // ← Cambiado: la relación en entregas_producto también se llama 'usuarios'
            select: { id: true, nombre_completo: true },
          },
        },
        orderBy: { fecha_hora_entrega: "desc" },
      },
      trazabilidad_proceso: {
        include: {
          usuarios: {  // ← Cambiado: la relación en trazabilidad_proceso también se llama 'usuarios'
            select: { id: true, nombre_completo: true },
          },
        },
        orderBy: { fecha_hora: "asc" },
      },
    },
  });

  if (!orden) throw createHttpError(404, "Orden de producción no encontrada");

  // Calcular cantidades desde los registros
  const cantidad_producida = orden.registro_produccion?.reduce(
    (sum, reg) => sum + (reg.cantidad_real_producida || 0), 0
  ) || 0;

  const cantidad_entregada = orden.entregas_producto?.reduce(
    (sum, ent) => sum + (ent.cantidad_entregada || 0), 0
  ) || 0;

  // Transformar para el frontend
  return {
    id: Number(orden.id),
    producto_id: Number(orden.producto_id),
    producto_nombre: orden.productos?.nombre,
    producto: orden.productos,
    cantidad_planeada: orden.cantidad_solicitada,
    cantidad_producida: cantidad_producida,
    cantidad_entregada: cantidad_entregada,
    estado: orden.estado,
    fecha_inicio: orden.fecha_creacion,
    fecha_fin_estimada: orden.fecha_requerida,
    prioridad: "media",
    observaciones: orden.observaciones,
    created_at: orden.fecha_creacion,
    updated_at: orden.fecha_creacion,
    created_by: Number(orden.usuario_creador_id),
    creador_nombre: orden.usuarios?.nombre_completo,
    notificado_bodega: orden.notificado_bodega,
    fecha_cancelacion: orden.fecha_cancelacion,
    registros_produccion: orden.registro_produccion.map(r => ({
      id: Number(r.id),
      orden_produccion_id: Number(r.orden_produccion_id),
      cantidad_real_producida: r.cantidad_real_producida,
      fecha_inicio: r.fecha_inicio,
      fecha_fin: r.fecha_fin,
      incidencias: r.incidencias,
      responsable_id: Number(r.responsable_id),
      responsable_nombre: r.usuarios?.nombre_completo,
      created_at: r.created_at
    })),
    entregas: orden.entregas_producto.map(e => ({
      id: Number(e.id),
      orden_produccion_id: Number(e.orden_produccion_id),
      cantidad_entregada: e.cantidad_entregada,
      fecha_hora_entrega: e.fecha_hora_entrega,
      observaciones: e.observaciones,
      responsable_id: Number(e.responsable_id),
      responsable_nombre: e.usuarios?.nombre_completo
    })),
    trazabilidad: orden.trazabilidad_proceso.map(t => ({
      id: Number(t.id),
      orden_produccion_id: Number(t.orden_produccion_id),
      tipo_evento: t.tipo_evento,
      descripcion: t.descripcion,
      datos_adicionales: t.datos_adicionales,
      fecha_hora: t.fecha_hora,
      responsable_id: Number(t.responsable_id),
      responsable_nombre: t.usuarios?.nombre_completo
    }))
  };
};

// ── CREATE ───────────────────────────────────────────────
// ── CREATE (CON VALIDACIÓN DE STOCK Y DESCUENTO) ─────────
export const createOrden = async (data, usuarioId) => {
  // Validaciones básicas
  if (!data.producto_id) throw createHttpError(400, "producto_id es requerido");

  const cantidad = parseInt(data.cantidad_solicitada, 10);
  if (!cantidad || cantidad <= 0)
    throw createHttpError(400, "cantidad_solicitada debe ser un entero positivo");

  if (!data.fecha_requerida) throw createHttpError(400, "fecha_requerida es requerida");

  const fechaRequerida = new Date(data.fecha_requerida);
  if (isNaN(fechaRequerida.getTime()))
    throw createHttpError(400, "fecha_requerida inválida");

  const productoId = parseBigIntId(data.producto_id, "producto_id");
  const creadorId = parseBigIntId(usuarioId, "usuario_id");

  // Obtener producto con su receta y materias primas
  const producto = await prisma.productos.findUnique({
    where: { id: productoId },
    include: {
      recetas: {
        include: {
          materia_prima: true
        }
      }
    }
  });

  if (!producto) throw createHttpError(404, "Producto no encontrado");
  
  if (producto.recetas.length === 0) {
    throw createHttpError(400, "El producto no tiene una receta definida");
  }

  // Validar stock y preparar movimientos
  const faltantes = [];
  const movimientos = [];

  for (const receta of producto.recetas) {
    const requerido = Number(receta.cantidad_necesaria) * cantidad;
    const disponible = Number(receta.materia_prima.cantidad_disponible);

    if (disponible < requerido) {
      faltantes.push({
        nombre: receta.materia_prima.nombre,
        disponible: disponible,
        requerido: requerido,
        faltante: requerido - disponible,
        unidad_medida: receta.unidad_medida
      });
    }

    movimientos.push({
      materia_prima_id: receta.ingrediente_id,
      cantidad: requerido,
      tipo_movimiento: 'salida',
      observaciones: `Consumo para orden de producción - Producto: ${producto.nombre}, Cantidad: ${cantidad}`
    });
  }

  // Si falta stock, error detallado
  if (faltantes.length > 0) {
    const error = new Error('Stock insuficiente');
    error.statusCode = 400;
    error.faltantes = faltantes;
    throw error;
  }

  // Transacción: crear orden y descontar inventario
  const result = await prisma.$transaction(async (tx) => {
    // 1. Crear la orden
    const orden = await tx.ordenes_produccion.create({
      data: {
        producto_id: productoId,
        cantidad_solicitada: cantidad,
        fecha_requerida: fechaRequerida,
        usuario_creador_id: creadorId,
        observaciones: data.observaciones?.trim() || null,
        estado: "pendiente",
      },
      include: includeProducto,
    });

    // 2. Descontar stock y crear movimientos de inventario
    for (const movimiento of movimientos) {
      await tx.materia_prima.update({
        where: { id: movimiento.materia_prima_id },
        data: {
          cantidad_disponible: {
            decrement: movimiento.cantidad
          }
        }
      });

      await tx.movimientos_inventario.create({
        data: {
          materia_prima_id: movimiento.materia_prima_id,
          tipo_movimiento: 'salida',
          cantidad: movimiento.cantidad,
          usuario_id: creadorId,
          orden_produccion_id: orden.id,
          observaciones: movimiento.observaciones
        }
      });
    }

    // 3. Registrar trazabilidad
    await tx.trazabilidad_proceso.create({
      data: {
        orden_produccion_id: orden.id,
        etapa: 'creacion',
        responsable_id: creadorId,
        accion_realizada: `Orden creada - Producto: ${producto.nombre}, Cantidad: ${cantidad}`,
        observaciones: `Se descontaron ${movimientos.length} materias primas del inventario`
      }
    });

    return orden;
  });

  // Transformar respuesta para el frontend
  return {
    id: Number(result.id),
    producto_id: Number(result.producto_id),
    producto_nombre: result.productos?.nombre,
    cantidad_planeada: result.cantidad_solicitada,
    estado: result.estado,
    fecha_fin_estimada: result.fecha_requerida,
    observaciones: result.observaciones,
    created_at: result.fecha_creacion,
    created_by: Number(result.usuario_creador_id),
    creador_nombre: result.usuarios?.nombre_completo
  };
};

// ── UPDATE ESTADO ────────────────────────────────────────
export const actualizarEstado = async (id, data, usuarioId) => {
  const ordenId = parseBigIntId(id, "orden_id");
  const nuevoEstado = data.estado;

  if (!nuevoEstado || !ESTADOS_VALIDOS.includes(nuevoEstado))
    throw createHttpError(400, `estado inválido. Valores posibles: ${ESTADOS_VALIDOS.join(", ")}`);

  const orden = await prisma.ordenes_produccion.findUnique({ where: { id: ordenId } });
  if (!orden) throw createHttpError(404, "Orden de producción no encontrada");

  const transicionesPermitidas = TRANSICIONES_PERMITIDAS[orden.estado] ?? [];
  if (!transicionesPermitidas.includes(nuevoEstado)) {
    throw createHttpError(
      400,
      `No se puede cambiar de "${orden.estado}" a "${nuevoEstado}". Transiciones válidas: ${transicionesPermitidas.join(", ") || "ninguna"}`
    );
  }

  const updateData = {
    estado:       nuevoEstado,
    observaciones: data.observaciones?.trim() || orden.observaciones,
  };

  if (nuevoEstado === "cancelada") {
    updateData.fecha_cancelacion = new Date();
  }

  const ordenActualizada = await prisma.ordenes_produccion.update({
    where:   { id: ordenId },
    data:    updateData,
    include: includeProducto,
  });

  // Registrar en trazabilidad
  await prisma.trazabilidad_proceso.create({
    data: {
      orden_produccion_id: ordenId,
      tipo_evento: 'cambio_estado',
      descripcion: `Estado cambiado de ${orden.estado} a ${nuevoEstado}`,
      responsable_id: parseBigIntId(usuarioId, "usuario_id"),
      datos_adicionales: JSON.stringify({ estado_anterior: orden.estado, estado_nuevo: nuevoEstado })
    }
  });

  return {
    id: Number(ordenActualizada.id),
    estado: ordenActualizada.estado,
    cantidad_planeada: ordenActualizada.cantidad_solicitada,
    producto_nombre: ordenActualizada.productos?.nombre,
    observaciones: ordenActualizada.observaciones
  };
};

// ── REGISTRO DE PRODUCCIÓN ───────────────────────────────
export const getRegistrosPorOrden = async (ordenId) => {
  const id = parseBigIntId(ordenId, "orden_id");

  const orden = await prisma.ordenes_produccion.findUnique({ where: { id } });
  if (!orden) throw createHttpError(404, "Orden de producción no encontrada");

  const registros = await prisma.registro_produccion.findMany({
    where: { orden_produccion_id: id },
    include: {
      usuarios: {  // ← Cambiado
        select: { id: true, nombre_completo: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return registros.map(r => ({
    id: Number(r.id),
    orden_produccion_id: Number(r.orden_produccion_id),
    cantidad_real_producida: r.cantidad_real_producida,
    fecha_inicio: r.fecha_inicio,
    fecha_fin: r.fecha_fin,
    incidencias: r.incidencias,
    responsable_id: Number(r.responsable_id),
    responsable_nombre: r.usuarios?.nombre_completo,
    created_at: r.created_at
  }));
};

export const crearRegistroProduccion = async (data, usuarioId) => {
  if (!data.orden_produccion_id)
    throw createHttpError(400, "orden_produccion_id es requerido");

  const cantidad = parseInt(data.cantidad_real_producida, 10);
  if (!cantidad || cantidad < 0)
    throw createHttpError(400, "cantidad_real_producida debe ser un entero no negativo");

  const ordenId      = parseBigIntId(data.orden_produccion_id, "orden_produccion_id");
  const responsableId = data.responsable_id
    ? parseBigIntId(data.responsable_id, "responsable_id")
    : parseBigIntId(usuarioId, "usuario_id");

  const orden = await prisma.ordenes_produccion.findUnique({ where: { id: ordenId } });
  if (!orden) throw createHttpError(404, "Orden de producción no encontrada");
  if (orden.estado === "cancelada")
    throw createHttpError(400, "No se puede registrar producción en una orden cancelada");

  const registro = await prisma.registro_produccion.create({
    data: {
      orden_produccion_id:     ordenId,
      cantidad_real_producida: cantidad,
      fecha_inicio:            data.fecha_inicio ? new Date(data.fecha_inicio) : null,
      fecha_fin:               data.fecha_fin    ? new Date(data.fecha_fin)    : null,
      incidencias:             data.incidencias?.trim() || null,
      responsable_id:          responsableId,
    },
    include: {
      usuarios: {  // ← Cambiado
        select: { id: true, nombre_completo: true },
      },
    },
  });

  // Registrar en trazabilidad
  await prisma.trazabilidad_proceso.create({
    data: {
      orden_produccion_id: ordenId,
      tipo_evento: 'registro_produccion',
      descripcion: `Registro de producción: ${cantidad} unidades`,
      responsable_id: responsableId,
      datos_adicionales: JSON.stringify({ cantidad_producida: cantidad })
    }
  });

  return {
    id: Number(registro.id),
    orden_produccion_id: Number(registro.orden_produccion_id),
    cantidad_real_producida: registro.cantidad_real_producida,
    fecha_inicio: registro.fecha_inicio,
    fecha_fin: registro.fecha_fin,
    incidencias: registro.incidencias,
    responsable_id: Number(registro.responsable_id),
    responsable_nombre: registro.usuarios?.nombre_completo,
    created_at: registro.created_at
  };
};

// ── ENTREGAS ─────────────────────────────────────────────
export const getEntregasPorOrden = async (ordenId) => {
  const id = parseBigIntId(ordenId, "orden_id");

  const orden = await prisma.ordenes_produccion.findUnique({ where: { id } });
  if (!orden) throw createHttpError(404, "Orden de producción no encontrada");

  const entregas = await prisma.entregas_producto.findMany({
    where: { orden_produccion_id: id },
    include: {
      usuarios: {  // ← Cambiado
        select: { id: true, nombre_completo: true },
      },
    },
    orderBy: { fecha_hora_entrega: "desc" },
  });

  return entregas.map(e => ({
    id: Number(e.id),
    orden_produccion_id: Number(e.orden_produccion_id),
    cantidad_entregada: e.cantidad_entregada,
    fecha_hora_entrega: e.fecha_hora_entrega,
    observaciones: e.observaciones,
    responsable_id: Number(e.responsable_id),
    responsable_nombre: e.usuarios?.nombre_completo
  }));
};

export const registrarEntrega = async (data, usuarioId) => {
  if (!data.orden_produccion_id)
    throw createHttpError(400, "orden_produccion_id es requerido");

  const cantidad = parseInt(data.cantidad_entregada, 10);
  if (!cantidad || cantidad <= 0)
    throw createHttpError(400, "cantidad_entregada debe ser un entero positivo");

  const ordenId       = parseBigIntId(data.orden_produccion_id, "orden_produccion_id");
  const responsableId = data.responsable_id
    ? parseBigIntId(data.responsable_id, "responsable_id")
    : parseBigIntId(usuarioId, "usuario_id");

  const orden = await prisma.ordenes_produccion.findUnique({ where: { id: ordenId } });
  if (!orden) throw createHttpError(404, "Orden de producción no encontrada");
  if (orden.estado === "cancelada")
    throw createHttpError(400, "No se puede registrar entrega en una orden cancelada");

  const entrega = await prisma.entregas_producto.create({
    data: {
      orden_produccion_id: ordenId,
      cantidad_entregada:  cantidad,
      responsable_id:      responsableId,
      observaciones:       data.observaciones?.trim() || null,
    },
    include: {
      usuarios: {  // ← Cambiado
        select: { id: true, nombre_completo: true },
      },
    },
  });

  // Registrar en trazabilidad
  await prisma.trazabilidad_proceso.create({
    data: {
      orden_produccion_id: ordenId,
      tipo_evento: 'entrega',
      descripcion: `Entrega de producto: ${cantidad} unidades`,
      responsable_id: responsableId,
      datos_adicionales: JSON.stringify({ cantidad_entregada: cantidad })
    }
  });

  return {
    id: Number(entrega.id),
    orden_produccion_id: Number(entrega.orden_produccion_id),
    cantidad_entregada: entrega.cantidad_entregada,
    fecha_hora_entrega: entrega.fecha_hora_entrega,
    observaciones: entrega.observaciones,
    responsable_id: Number(entrega.responsable_id),
    responsable_nombre: entrega.usuarios?.nombre_completo
  };
};

// ── TRAZABILIDAD ─────────────────────────────────────────
export const getTrazabilidadPorOrden = async (ordenId) => {
  const id = parseBigIntId(ordenId, "orden_id");

  const orden = await prisma.ordenes_produccion.findUnique({ where: { id } });
  if (!orden) throw createHttpError(404, "Orden de producción no encontrada");

  const trazabilidad = await prisma.trazabilidad_proceso.findMany({
    where: { orden_produccion_id: id },
    include: {
      usuarios: {  // ← Cambiado
        select: { id: true, nombre_completo: true },
      },
    },
    orderBy: { fecha_hora: "asc" },
  });

  return trazabilidad.map(t => ({
    id: Number(t.id),
    orden_produccion_id: Number(t.orden_produccion_id),
    tipo_evento: t.tipo_evento,
    descripcion: t.descripcion,
    datos_adicionales: t.datos_adicionales,
    fecha_hora: t.fecha_hora,
    responsable_id: Number(t.responsable_id),
    responsable_nombre: t.usuarios?.nombre_completo
  }));
};