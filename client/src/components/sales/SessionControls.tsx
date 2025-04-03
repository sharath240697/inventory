import { DeleteIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Spacer, Stack, Text } from "@chakra-ui/react";
import { usePostApi } from "../../hooks/usePostApi";
import { useSearch } from "../../context/SearchContext";
import { useSales } from "../../context/SalesContext";
import { ScanType_t } from "../../../types";

interface PrintResponse {
    message: string;
    data: any;
    error: any;
  }

export default function SessionControls() {
    const postApi = usePostApi<PrintResponse>();
    const { setSearchQuery, setFilteredItems } = useSearch();
    const { scannedValue, setScannedValue } = useSales();
    const { customerName, setCustomerName, customerMobile, setCustomerMobile } = useSales();


    const handlePrint = async () => {
        try {
            const orderNumber = `ORD-${Date.now()}`;
            const filteredItems = scannedValue.filter(item => item.quantity > 0);
            const requestBody = {
                items: filteredItems.map((item: ScanType_t) => ({
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
        setCustomerName('')
        setCustomerMobile('')
        setScannedValue([])
        setSearchQuery('')
        setFilteredItems([])
    }

    return (
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
    );
}