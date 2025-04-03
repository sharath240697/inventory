import { DeleteIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Box, FormControl, FormLabel, Input, Spacer, Stack, Text } from "@chakra-ui/react";
import { usePostApi } from "../../hooks/usePostApi";
import { useSales } from "../../context/SalesContext";
import { Item_t, ScanType } from "../../../types";
import { useRef } from "react";
import { useGetApi } from "../../hooks/useGetApi";

interface PrintResponse {
    message: string;
    data: any;
    error: any;
}

export default function SessionControls() {
    const postApi = usePostApi<PrintResponse>();
    const myRef = useRef<HTMLInputElement>(null);
    const { data: masterData } = useGetApi<{ masterData: Item_t[] }>('http://localhost:3000/masterdata');
        
    const { scannedValue, setScannedValue } = useSales();
    const { customerName, setCustomerName, customerMobile, setCustomerMobile } = useSales();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        if (e.key === "Enter") {
            e.preventDefault()
            if (value === "") {
                window.alert("Please enter a value")
                return
            }

            const item = masterData?.masterData.find(item => item.sku === value)
            if (item) {
                setScannedValue(prevState => {
                    const existingItemIndex = prevState.findIndex(item => item.sku === value)
                    if (existingItemIndex !== -1) {
                        const existingItem = prevState[existingItemIndex]
                        return [
                            ...prevState.slice(0, existingItemIndex),
                            {
                                ...existingItem,
                                quantity: existingItem.quantity + 1,
                                price: Math.ceil((existingItem.quantity + 1) * item.sellingPerQuantity)
                            },
                            ...prevState.slice(existingItemIndex + 1)
                        ]
                    }
                    return [...prevState, { sku: value, quantity: 1, name: item.name, unitMrp: item.mrpPerQuantity, unitPrice: Math.ceil(item.sellingPerQuantity), price: Math.ceil(item.sellingPerQuantity) }]
                })
            } else {
                window.alert(`Item not found: ${value}`)
            }

            // Clear the input field safely
            if (myRef.current) {
                myRef.current.value = ''
            }
        }
    }

    const handlePrint = async () => {
        try {
            const orderNumber = `ORD-${Date.now()}`;
            const filteredItems = scannedValue.filter(item => item.quantity > 0);
            const requestBody = {
                items: filteredItems.map((item: ScanType) => ({
                    name: item.name || '',
                    quantity: item.quantity,
                    mrp: item.unitMrp || 0,
                    price: item.unitPrice || 0
                })),
                customerName: customerName || 'Customer',
                customerMobile: customerMobile || '',
                orderNumber: orderNumber
            };

            await postApi.post('http://localhost:3000/print-bill', requestBody);
            window.alert(`Print response: ${postApi.data?.message}`);
        } catch (error) {
            console.error('Error printing receipt:', error);
            window.alert('Failed to print receipt');
        }
    };

    const clearSession = () => {
        setScannedValue([]);
        setCustomerName('');
        setCustomerMobile('');
    }

    return (
        <Box bg="blue.50" p={4} borderRadius="md">
            <FormControl mb={4}>
                <FormLabel>Scan Item..</FormLabel>
                <Input
                    type="text"
                    ref={myRef}
                    onKeyDown={handleKeyDown}
                    placeholder="Scan Item barcode"
                    size="lg"
                    bg="white"
                    autoFocus
                />
            </FormControl>

            <Stack direction="row" w="100%">
                <Spacer />
                <ButtonGroup>
                    <Button
                        colorScheme="blue"
                        size="md"
                        onClick={handlePrint}
                    >
                        Print Bill
                        <Text as="span" ml={2}>🖨️</Text>
                    </Button>

                    <Button
                        colorScheme="red"
                        size="md"
                        onClick={clearSession}
                    >
                        Clear Session
                        <DeleteIcon ml={2} />
                    </Button>
                </ButtonGroup>
            </Stack>
        </Box>
    );
}