// Enums
export enum Province {
  AMAZONAS = 'AMAZONAS',
  ANCASH = 'ANCASH',
  APURIMAC = 'APURIMAC',
  AREQUIPA = 'AREQUIPA',
  AYACUCHO = 'AYACUCHO',
  CAJAMARCA = 'CAJAMARCA',
  CALLAO = 'CALLAO',
  CUSCO = 'CUSCO',
  HUANCAVELICA = 'HUANCAVELICA',
  HUANUCO = 'HUANUCO',
  ICA = 'ICA',
  JUNIN = 'JUNIN',
  LA_LIBERTAD = 'LA_LIBERTAD',
  LAMBAYEQUE = 'LAMBAYEQUE',
  LIMA = 'LIMA',
  LORETO = 'LORETO',
  MADRE_DE_DIOS = 'MADRE_DE_DIOS',
  MOQUEGUA = 'MOQUEGUA',
  PASCO = 'PASCO',
  PIURA = 'PIURA',
  PUNO = 'PUNO',
  SAN_MARTIN = 'SAN_MARTIN',
  TACNA = 'TACNA',
  TUMBES = 'TUMBES',
  UCAYALI = 'UCAYALI'
}

export enum HousingState {
  EN_PROYECTO = 'EN_PROYECTO',
  EN_CONSTRUCCION = 'EN_CONSTRUCCION',
  NUEVO = 'NUEVO',
  SEGUNDA = 'SEGUNDA'
}

export enum HousingCategory {
  SOSTENIBLE = 'SOSTENIBLE',
  TRADICIONAL = 'TRADICIONAL'
}

// Response del backend
export interface HousingResponse {
  id: number;
  realStateCompanyId: number;
  title: string;
  description: string;
  province: string;
  district: string;
  address: string;
  department: string;
  area: number;
  roomQuantity: number;
  salePrice: number;
  housingState: string;
  housingCategory: string;
  currencySymbol: string;
}

// Request para crear
export interface CreateHousingRequest {
  realStateCompanyId: number;
  title: string;
  description: string;
  province: string;
  district: string;
  address: string;
  department: string;
  area: number;
  roomQuantity: number;
  salePrice: number;
  housingState: string;
  housingCategory: string;
  currencyId: number;
}

// Request para actualizar
export interface UpdateHousingRequest {
  title: string;
  description: string;
  province: string;
  district: string;
  address: string;
  department: string;
  area: number;
  roomQuantity: number;
  salePrice: number;
  housingState: string;
  housingCategory: string;
  currencyId: number;
}

// Para el modal
export interface HousingModalData {
  mode: 'create' | 'edit';
  housing?: HousingResponse;
}

// Helper para traducir provincias
export const ProvinceLabels: Record<Province, string> = {
  [Province.AMAZONAS]: 'Amazonas',
  [Province.ANCASH]: 'Áncash',
  [Province.APURIMAC]: 'Apurímac',
  [Province.AREQUIPA]: 'Arequipa',
  [Province.AYACUCHO]: 'Ayacucho',
  [Province.CAJAMARCA]: 'Cajamarca',
  [Province.CALLAO]: 'Callao',
  [Province.CUSCO]: 'Cusco',
  [Province.HUANCAVELICA]: 'Huancavelica',
  [Province.HUANUCO]: 'Huánuco',
  [Province.ICA]: 'Ica',
  [Province.JUNIN]: 'Junín',
  [Province.LA_LIBERTAD]: 'La Libertad',
  [Province.LAMBAYEQUE]: 'Lambayeque',
  [Province.LIMA]: 'Lima',
  [Province.LORETO]: 'Loreto',
  [Province.MADRE_DE_DIOS]: 'Madre de Dios',
  [Province.MOQUEGUA]: 'Moquegua',
  [Province.PASCO]: 'Pasco',
  [Province.PIURA]: 'Piura',
  [Province.PUNO]: 'Puno',
  [Province.SAN_MARTIN]: 'San Martín',
  [Province.TACNA]: 'Tacna',
  [Province.TUMBES]: 'Tumbes',
  [Province.UCAYALI]: 'Ucayali'
};

// Helper para traducir estados
export const HousingStateLabels: Record<HousingState, string> = {
  [HousingState.EN_PROYECTO]: 'En Proyecto',
  [HousingState.EN_CONSTRUCCION]: 'En Construcción',
  [HousingState.NUEVO]: 'Nuevo',
  [HousingState.SEGUNDA]: 'Segunda Mano'
};

// Helper para traducir categorías
export const HousingCategoryLabels: Record<HousingCategory, string> = {
  [HousingCategory.SOSTENIBLE]: 'Sostenible',
  [HousingCategory.TRADICIONAL]: 'Tradicional'
};
