export const ROLES = {
  ADMINISTRATIVO: "administrativo",
  JEFE_PRODUCCION: "jefe_produccion",
  AUXILIAR: "auxiliar",
};

export const ROLE_LABELS = {
  [ROLES.ADMINISTRATIVO]: "Acceso a reportes, gestión de usuarios y configuraciones",
  [ROLES.JEFE_PRODUCCION]: "Gestión de órdenes, recetas y supervisión de producción",
  [ROLES.AUXILIAR]: "Preparación de bodega, registro de producción y entregas",
};

export const ALL_ROLES = Object.values(ROLES);

export default ROLES;