export interface Item_t {
    sku: string;
    name: string;
    quantity: number;
    unit: string;
    mrpPerQuantity: number;
    sellingPerQuantity: number;
    paidCostPerQuantity: number;
    allowLoose?: boolean;
    minQuantity?: number;
}

export interface ScanType {
    sku: string;
    quantity: number;
    name?: string;
    unitMrp?: number;
    unitPrice?: number;
    price: number;
    allowLoose?: boolean;
    minQuantity?: number;
}