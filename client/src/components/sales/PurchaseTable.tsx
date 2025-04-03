import { Box, Flex, IconButton, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useSales } from "../../context/SalesContext";
import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";

export default function PurchaseTable() {
    const { scannedValue, setScannedValue,
    } = useSales();


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
                    quantity: newQuantity,
                    price: newQuantity * Math.ceil(item.unitPrice || 0)
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

    const handleQuantityChange = (index: number, value: string) => {
        const item = scannedValue[index]
        const newQuantity = item.allowLoose ? parseFloat(value) : parseInt(value)
        if (isNaN(newQuantity) || newQuantity <= 0) {
            return
        }

        setScannedValue(prevState => {
            const item = prevState[index]
            return [
                ...prevState.slice(0, index),
                {
                    ...item,
                    quantity: newQuantity,
                    price: newQuantity * Math.ceil(item.unitPrice || 0)
                },
                ...prevState.slice(index + 1)
            ]
        })
    }

    return (
        <Box
            overflowX="auto"
            overflowY="auto"
            maxHeight="400px"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
        >
            <Table variant="simple" size="md">
                <Thead>
                    <Tr bg="gray.50">
                        <Th>Item</Th>
                        <Th isNumeric>Qty</Th>
                        <Th isNumeric>MRP</Th>
                        <Th isNumeric>Price</Th>
                        <Th isNumeric>Total</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {scannedValue.map((item, index) => (
                        <Tr key={index}>
                            <Td>{item.name}</Td>
                            <Td isNumeric>
                                <Flex alignItems="center" gap={2}>
                                    <IconButton
                                        size="sm"
                                        variant="outline"
                                        colorScheme="red"
                                        aria-label="Decrease quantity"
                                        icon={<MinusIcon />}
                                        onClick={() => handleQuantityAction(index, 'decrease')}
                                        isDisabled={item.quantity <= (item.minQuantity || (item.allowLoose ? 0.1 : 1))}
                                    />
                                    <Input
                                        type="number"
                                        size="md"
                                        value={item.allowLoose ? item.quantity.toFixed(3) : item.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        min={item.minQuantity || (item.allowLoose ? "0.1" : 1)}
                                        step={item.allowLoose ? "0.1" : 1}
                                        width="100px"
                                        fontSize="xl"
                                        textAlign="center"
                                    />
                                    <IconButton
                                        size="sm"
                                        variant="outline"
                                        colorScheme="green"
                                        aria-label="Increase quantity"
                                        icon={<AddIcon />}
                                        onClick={() => handleQuantityAction(index, 'increase')}
                                    />
                                </Flex>
                            </Td>
                            <Td isNumeric>₹{item.unitMrp}</Td>
                            <Td isNumeric>₹{item.unitPrice}</Td>
                            <Td isNumeric>₹{item.price.toFixed(2)}</Td>
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
    )
}