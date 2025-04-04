import { Box, Button, Flex, IconButton, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { usePurchaseTable } from "../../context/PurchaseTableContext";
import PurchaseQuantityModal from "./PurchaseQuantityModal";
import { useRef } from "react";

export default function PurchaseTable() {

    const { scannedValue, setScannedValue,
        onOpen, setSelectedItemIndex,
        setInputValue, setIsValid,
    } = usePurchaseTable();
    const miscRef = useRef<HTMLInputElement>(0);

    const handleQuantityAction = (index: number, action: 'increase' | 'decrease') => {
        setScannedValue(prevState => {
            const item = prevState[index]
            const min = item.minQuantity || (item.allowLoose ? 0.1 : 1)
            const step = item.allowLoose ? 0.1 : 1
            const newQuantity = action === 'increase' ? item.quantity + step : Math.max(min, item.quantity - step)
            return [
                ...prevState.slice(0, index),
                {
                    ...item,
                    quantity: parseFloat(newQuantity.toFixed(3)),
                    price: Math.ceil(newQuantity * (item.unitPrice || 0))
                },
                ...prevState.slice(index + 1)
            ]
        })
    }

    const handleRemoveItem = (index: number) => {
        setScannedValue(prevState => [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1)
        ])
    }

    return (
        <Box>
            <Box
                overflowX="auto"
                overflowY="auto"
                maxHeight="400px"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
                bg="white"
                shadow="sm"
            >
                <Table size="sm" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Item</Th>
                            <Th>Quantity</Th>
                            <Th>MRP</Th>
                            <Th>Unit Price</Th>
                            <Th>Price</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {scannedValue.map((item, index) => (
                            <Tr key={item.sku}>
                                <Td>{item.name}</Td>
                                <Td>
                                    <Flex alignItems="center" gap={2}>
                                        {item.name != 'misc' && <IconButton
                                            size="sm"
                                            variant="outline"
                                            colorScheme="red"
                                            aria-label="Decrease quantity"
                                            icon={<MinusIcon />}
                                            onClick={() => handleQuantityAction(index, 'decrease')}
                                            isDisabled={item.quantity <= (item.minQuantity || (item.allowLoose ? 0.1 : 1))}
                                        />}
                                        <Button
                                            size="sm"
                                            isDisabled={item.name == 'misc' && scannedValue.find(item => item.name == 'misc') != undefined}
                                            aria-label="Enter quantity"
                                            onClick={() => {
                                                setSelectedItemIndex(index);
                                                setInputValue(item.quantity.toString());
                                                setIsValid(true);
                                                onOpen();
                                            }}
                                        >
                                            {item.quantity}
                                        </Button>
                                        {item.name != 'misc' && <IconButton
                                            size="sm"
                                            variant="outline"
                                            colorScheme="green"
                                            aria-label="Increase quantity"
                                            icon={<AddIcon />}
                                            onClick={() => handleQuantityAction(index, 'increase')}
                                        />}
                                    </Flex>
                                </Td>
                                <Td isNumeric>₹{item.unitMrp}</Td>
                                <Td isNumeric>₹{item.unitPrice}</Td>
                                <Td isNumeric>₹{item.price}</Td>
                                <Td isNumeric>
                                    {item.name == 'misc' && (
                                        <>
                                            <Input
                                                type="number"
                                                ref={miscRef}
                                                size="sm"
                                                placeholder="Enter price"
                                                min="0"
                                            />
                                            <IconButton
                                                size="sm"
                                                variant="outline"
                                                colorScheme="green"
                                                aria-label="Increase quantity"
                                                icon={<AddIcon />}
                                                onClick={() => {
                                                    const newPrice = parseFloat(miscRef.current.value);
                                                    if (!isNaN(newPrice) && newPrice >= 0) {
                                                        setScannedValue(prevState => {
                                                            return [
                                                                ...prevState.slice(0, index),
                                                                {
                                                                    ...item,
                                                                    price: item.price + newPrice,
                                                                    quantity: item.quantity + 1
                                                                },
                                                                ...prevState.slice(index + 1)
                                                            ];
                                                        });
                                                    }
                                                }}
                                            />
                                        </>
                                    )}
                                </Td>
                                <Td>
                                    <IconButton
                                        size="sm"
                                        variant="outline"
                                        colorScheme="red"
                                        aria-label="Remove item"
                                        icon={<DeleteIcon />}
                                        onClick={() => handleRemoveItem(index)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <PurchaseQuantityModal />
        </Box>
    )
}