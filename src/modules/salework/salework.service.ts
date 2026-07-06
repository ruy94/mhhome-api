import { Injectable } from '@nestjs/common';

import { SaleworkClientService } from '../integrations/salework/salework-client.service.js';
import type {
  SaleworkAddressData,
  SaleworkInventoryTransactionsData,
  SaleworkLogisticsData,
  SaleworkMutationResult,
  SaleworkProductReportData,
  SaleworkProductsData,
} from '../integrations/salework/salework.types.js';
import type {
  CreateSaleworkInStoreOrderDto,
  CreateSaleworkSelfLogisticsOrderDto,
  CreateSaleworkThirdLogisticsOrderDto,
} from './dto/create-salework-order.dto.js';
import type { CreateSaleworkDebtDto, GenerateSaleworkQrDto } from './dto/salework-debt.dto.js';
import type { SaleworkInventoryTransactionDto } from './dto/salework-inventory-transaction.dto.js';
import type { SaleworkProductReportDto } from './dto/salework-report.dto.js';
import type { SaleworkWarehouseTransactionDto } from './dto/salework-warehouse.dto.js';

@Injectable()
export class SaleworkService {
  constructor(private readonly saleworkClient: SaleworkClientService) {}

  getProducts(): Promise<SaleworkProductsData> {
    return this.saleworkClient.getProducts();
  }

  getAddressList(): Promise<SaleworkAddressData> {
    return this.saleworkClient.getAddressList();
  }

  getLogistics(): Promise<SaleworkLogisticsData> {
    return this.saleworkClient.getLogistics();
  }

  createThirdLogisticsOrder(dto: CreateSaleworkThirdLogisticsOrderDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.createOrder(dto);
  }

  createSelfLogisticsOrder(dto: CreateSaleworkSelfLogisticsOrderDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.createOrder(dto);
  }

  createInStoreOrder(dto: CreateSaleworkInStoreOrderDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.createOrder(dto);
  }

  warehouseImport(dto: SaleworkWarehouseTransactionDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.warehouseImport(dto);
  }

  warehouseExport(dto: SaleworkWarehouseTransactionDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.warehouseExport(dto);
  }

  warehouseReturn(dto: SaleworkWarehouseTransactionDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.warehouseReturn(dto);
  }

  getProductReport(dto: SaleworkProductReportDto): Promise<SaleworkProductReportData> {
    return this.saleworkClient.getProductReport(dto);
  }

  getInventoryTransactions(dto: SaleworkInventoryTransactionDto): Promise<SaleworkInventoryTransactionsData> {
    return this.saleworkClient.getInventoryTransactions(dto);
  }

  getMerchants() {
    return this.saleworkClient.getMerchants();
  }

  createDebt(dto: CreateSaleworkDebtDto) {
    return this.saleworkClient.createDebt(dto);
  }

  generateQr(dto: GenerateSaleworkQrDto) {
    return this.saleworkClient.generateQr(dto);
  }
}

