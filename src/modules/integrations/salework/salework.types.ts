export type SaleworkStockV1Response<T> = {
  status?: string;
  data?: T;
  message?: string;
  error?: string;
};

export type SaleworkStockV2Response<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type SaleworkBankingResponse<T> = {
  data?: T;
  version?: string;
  message?: string;
  error?: string;
};

export type SaleworkRecord = Record<string, unknown>;

export type SaleworkProductCode = string;
export type SaleworkWarehouseId = string;

export type SaleworkProductStock = {
  wid: SaleworkWarehouseId;
  value: number;
};

export type SaleworkProductItem = {
  _id: string;
  code: SaleworkProductCode;
  retailPrice: number;
  cost: number;
  name: string;
  image: string;
  wholesalePrice: number;
  barcode?: string;
  stocks: SaleworkProductStock[];
};

export type SaleworkProductsMap = Record<SaleworkProductCode, SaleworkProductItem>;

export type SaleworkWarehouseBin = {
  name: string;
  bid: string;
  createdAt: string;
  updatedAt: string;
};

export type SaleworkPickUpAddress = {
  pick_tel: string;
  pick_address: string;
  pick_province: string;
  pick_district: string;
  pick_ward: string;
};

export type SaleworkWarehouse = {
  _id: string;
  name: string;
  wid: SaleworkWarehouseId;
  createdAt: string;
  updatedAt: string;
  address?: string;
  phone?: string;
  type?: string;
  bins: SaleworkWarehouseBin[];
  pickUpAddress?: SaleworkPickUpAddress;
  createdBy?: string;
  updatedBy?: string;
};

export type SaleworkProductsData = {
  products: SaleworkProductsMap;
  warehouses: SaleworkWarehouse[];
};

export type SaleworkProductsApiData = {
  products?: SaleworkProductsMap;
  warehouses?: SaleworkWarehouse[];
  warehouse?: SaleworkWarehouse[];
};

export type SaleworkAddressNode = {
  name: string;
  parent?: string;
  children?: string[];
  ghnId?: number | string;
  viettelCode?: number;
};

export type SaleworkAddressMap = Record<string, SaleworkAddressNode>;

export type SaleworkAddressData = {
  provinces: SaleworkAddressMap;
  districts: SaleworkAddressMap;
  wards: SaleworkAddressMap;
  provinces_new: SaleworkAddressMap;
  wards_new: SaleworkAddressMap;
};

export type SaleworkAddressApiData = SaleworkAddressData | {
  addresses?: Partial<SaleworkAddressData>;
};

export type SaleworkLogisticsItem = {
  id: string;
  name: string;
  price?: string | number;
  selected?: boolean;
  image?: string;
};

export type SaleworkLogisticsData = {
  logistics: SaleworkLogisticsItem[];
};

export type SaleworkProductReportItem = {
  code: string;
  amount: number;
  revenue: number;
  name: string;
  image: string;
};

export type SaleworkProductReportShop = {
  shopId: string | number;
  products: SaleworkProductReportItem[];
};

export type SaleworkProductReportData = {
  product_report: Record<string, SaleworkProductReportShop[]>;
};

export type SaleworkInventoryTransactionItem = {
  productCode: string;
  amount: number;
  bin?: string;
  order?: string;
  return?: number;
  broken?: number;
  model_id?: string | number;
  cost?: number;
  price?: number;
  status?: string;
};

export type SaleworkInventoryTransaction = {
  code: string;
  type: string;
  state: string;
  items: SaleworkInventoryTransactionItem[];
  note?: string;
  sourceWarehouse?: string;
  createdAt?: string;
  updatedAt?: string;
  ordersPack?: unknown | null;
};

export type SaleworkInventoryTransactionsData = {
  transactions: SaleworkInventoryTransaction[];
  next_cursor: number;
};

export type SaleworkInventoryTransactionsApiData = SaleworkInventoryTransactionsData | {
  transaction?: SaleworkInventoryTransaction[];
  next_cursor?: number;
};

export type SaleworkMutationResult = SaleworkRecord;

export type SaleworkInventoryTransactionType =
  | 'allImport'
  | 'allExport'
  | 'newImport'
  | 'returnImport'
  | 'freeImport'
  | 'freeExport'
  | 'saleExport'
  | 'returnOrder';

