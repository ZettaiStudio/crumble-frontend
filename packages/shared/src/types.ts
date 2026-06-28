export interface Empresa {
  id: string;
  nombre: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Sucursal {
  id: string;
  empresaId: string;
  nombre: string;
  direccion: string;
  telefono: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Mesa {
  id: string;
  sucursalId: string;
  numero: number;
  createdAt: string;
}

export interface PrecioHistorico {
  id: string;
  precio: number;
  vigenteDesde: string;
}

export interface Plato {
  id: string;
  sucursalId: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  categoria: string | null;
  datosNutricionales: string | null;
  precioActual: number;
  esVisible: boolean;
  esDisponible: boolean;
  esSugerenciaDelDia: boolean;
  esSugerenciaDelChef: boolean;
  createdAt: string;
  updatedAt: string | null;
  historialPrecios: PrecioHistorico[];
}

export interface Oferta {
  id: string;
  sucursalId: string;
  titulo: string;
  descripcion: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  esActiva: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ConvenioTarjeta {
  id: string;
  sucursalId: string;
  nombreTarjeta: string;
  descripcion: string;
  porcentajeDescuento: number;
  esActivo: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PersonalizacionCarta {
  id: string;
  sucursalId: string;
  logoUrl: string | null;
  fondoUrl: string | null;
  colorPrimario: string | null;
  colorSecundario: string | null;
  colorTexto: string | null;
  fuenteTitulos: string | null;
  fuenteCuerpo: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Aviso {
  id: string;
  sucursalId: string;
  contenido: string;
  esActivo: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AccesoCartaResponse {
  valido: boolean;
  sucursalId: string | null;
  numeroMesa: number | null;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  userId: string;
  email: string;
  nombreCompleto: string;
  empresaId: string | null;
}

export interface ResumenMetricas {
  sucursalId: string;
  desde: string;
  hasta: string;
  totalScansQr: number;
  totalVistasPlatos: number;
  totalBusquedas: number;
  totalLlamadasMozo: number;
  totalLoginsBackoffice: number;
  totalEdicionesPlatos: number;
  totalCargasPlatos: number;
}
