import { ScannedItemType } from "../types";
import { useDisclosure } from "@chakra-ui/react";
import React, { useContext, useState } from "react";

interface PurchaseTableContextType {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    selectedItemIndex: number | null;
    setSelectedItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    isValid: boolean;
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
    scannedValue: ScannedItemType[];
    setScannedValue: React.Dispatch<React.SetStateAction<ScannedItemType[]>>;
}

export const PurchaseTableContext = React.createContext<PurchaseTableContextType | undefined>(undefined);

export function PurchaseTableContextProvider({ children, scannedValue, setScannedValue }:
    { children: React.ReactNode, scannedValue: ScannedItemType[], setScannedValue: React.Dispatch<React.SetStateAction<ScannedItemType[]>> }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedItemIndex, setSelectedItemIndex] = React.useState<number | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isValid, setIsValid] = useState(false);

    


    return (
        <PurchaseTableContext.Provider value={{
            isOpen, onOpen, onClose,
            selectedItemIndex, setSelectedItemIndex,
            inputValue, setInputValue,
            isValid, setIsValid,
            scannedValue, setScannedValue
        }}>
            {children}
        </PurchaseTableContext.Provider>
    );
}


export function usePurchaseTable() {
    const context = useContext(PurchaseTableContext);
    if (context === undefined) {
        throw new Error('usePurchaseTable must be used within a PurchaseTableContextProvider');
    }
    return context;
}