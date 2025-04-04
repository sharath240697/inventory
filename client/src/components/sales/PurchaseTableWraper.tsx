import { PurchaseTableContextProvider } from "../../context/PurchaseTableContext";
import { ScannedItemType } from "../../types";
import PurchaseTable from "./PurchaseTable";

export interface PurchaseTableProps {
    scannedValue: ScannedItemType[];
    setScannedValue: React.Dispatch<React.SetStateAction<ScannedItemType[]>>;
}

export default function PurchaseTableWraper({ scannedValue, setScannedValue }: PurchaseTableProps) {
    return (
        <PurchaseTableContextProvider scannedValue={scannedValue} setScannedValue={setScannedValue}>
            <PurchaseTable />
        </PurchaseTableContextProvider>

    )
}