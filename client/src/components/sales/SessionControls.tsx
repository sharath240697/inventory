import { DeleteIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Box, FormControl, FormLabel, Input, Spacer, Spinner, Stack, Text } from "@chakra-ui/react";
import { usePostApi } from "../../hooks/usePostApi";
import { useSales } from "../../context/SalesContext";
import { ScanType } from "../../../types";
import { useRef, useState } from "react";
import { useSearch } from "../../context/SearchContext";

interface PrintResponse {
    message: string;
    data: any;
    error: any;
}

export default function SessionControls() {
    const postApi = usePostApi<PrintResponse>();
    const myRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { scannedValue, setScannedValue, looseItem, setLooseItem } = useSales();
    const { setSearchQuery, setFilteredItems } = useSearch();
    const { customerName, setCustomerName, customerMobile, setCustomerMobile } = useSales();

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        if (e.key === "Enter") {
            e.preventDefault()
            if (value === "") {
                window.alert("Please enter a value")
                return
            }

            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/get-item?sku=${encodeURIComponent(value)}`);
                const data = await response.json();

                if (data.item) {
                    if (data.item.allowLoose) {
                        setLooseItem(prevState => {
                            const existingItemIndex = prevState.findIndex(item => item.sku === value)
                            if (existingItemIndex !== -1) {
                                const existingItem = prevState[existingItemIndex]
                                return [
                                    ...prevState.slice(0, existingItemIndex),
                                    {
                                        ...existingItem,
                                        quantity: existingItem.quantity + 1,
                                        price: Math.ceil((existingItem.quantity + 1) * data.item.sellingPerQuantity)
                                    },
                                    ...prevState.slice(existingItemIndex + 1)
                                ]
                            }
                            return [...prevState, {
                                sku: value,
                                quantity: 1,
                                name: data.item.name,
                                unitMrp: data.item.mrpPerQuantity,
                                unitPrice: Math.ceil(data.item.sellingPerQuantity),
                                price: Math.ceil(data.item.sellingPerQuantity),
                                allowLoose: data.item.allowLoose,
                                minQuantity: data.item.minQuantity
                            }]
                        })
                    } else {
                        setScannedValue(prevState => {
                            const existingItemIndex = prevState.findIndex(item => item.sku === value)
                            if (existingItemIndex !== -1) {
                                const existingItem = prevState[existingItemIndex]
                                return [
                                    ...prevState.slice(0, existingItemIndex),
                                    {
                                        ...existingItem,
                                        quantity: existingItem.quantity + 1,
                                        price: Math.ceil((existingItem.quantity + 1) * data.item.sellingPerQuantity)
                                    },
                                    ...prevState.slice(existingItemIndex + 1)
                                ]
                            }
                            return [...prevState, {
                                sku: value,
                                quantity: 1,
                                name: data.item.name,
                                unitMrp: data.item.mrpPerQuantity,
                                unitPrice: Math.ceil(data.item.sellingPerQuantity),
                                price: Math.ceil(data.item.sellingPerQuantity),
                                allowLoose: data.item.allowLoose,
                                minQuantity: data.item.minQuantity
                            }]
                        })
                    }
                } else {
                    window.alert(`Item not found: ${value}`)
                }
            } catch (error) {
                console.error('Error fetching item:', error);
                window.alert(`Error fetching item: ${value}`)
            } finally {
                setIsLoading(false);
                // Clear the input field safely
                if (myRef.current) {
                    myRef.current.value = ''
                }
            }
        }
    }

    const handlePrint = async () => {
        try {
            const orderNumber = `ORD-${Date.now()}`;
            const filteredItems = [...scannedValue, ...looseItem].filter(item => item.quantity > 0);
            const requestBody = {
                items: filteredItems.map((item: ScanType) => ({
                    name: item.name || '',
                    quantity: item.quantity,
                    mrp: item.unitMrp || 0,
                    price: item.unitPrice || 0
                })),
                customerName: customerName || 'NA',
                customerMobile: customerMobile || 'NA',
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
        setFilteredItems([]);
        setSearchQuery('');
    }

    return (
        <Box bg="blue.50" p={4} borderRadius="md">
            <FormControl mb={4}>
                <FormLabel>Scan Item.. {isLoading && <Spinner size="xs" ml={2} color="blue.500" />}</FormLabel>
                <Input
                    type="text"
                    ref={myRef}
                    onKeyDown={handleKeyDown}
                    placeholder="Scan Item barcode"
                    size="lg"
                    isDisabled={isLoading}
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