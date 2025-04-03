import { Box, Flex, FormControl, FormLabel, Heading, IconButton, Input, Spacer, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useSales } from "../../context/SalesContext";
import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useGetApi } from "../../hooks/useGetApi";
import { Item_t } from "../../../types";
import SessionControls from "./SessionControls";



export default function PurchaseTable() {
    const { scannedValue, setScannedValue, totalPrice,
    } = useSales();
    const myRef = useRef<HTMLInputElement>(null);

    const { data: masterData } = useGetApi<{ masterData: Item_t[] }>('http://localhost:3000/masterdata');

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
        setScannedValue(prevState => {
            return [
                ...prevState.slice(0, index),
                ...prevState.slice(index + 1)
            ]
        })
    }



    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        if (e.key === "Enter") {
            e.preventDefault()
            if (value === "") {
                window.alert("Please enter a value")
                return
            }

            const item = masterData?.masterData.find(item => item.barcode === value)
            if (item) {
                setScannedValue(prevState => {
                    const existingItemIndex = prevState.findIndex(item => item.barcode === value)
                    if (existingItemIndex !== -1) {
                        const updatedItems = [...prevState]
                        updatedItems[existingItemIndex].quantity += 1
                        return updatedItems
                    }
                    return [...prevState, { barcode: value, quantity: 1, name: item.name, unitMrp: item.mrpPerQuantity, unitPrice: Math.ceil(item.sellingPerQuantity), price: Math.ceil(item.sellingPerQuantity) }]
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
        <Box w="48vw">
            <Heading size="md" mb={4}>Purchased Items</Heading>
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

            {totalPrice > 0 && (
                <Flex
                    mt={4}
                    p={4}
                    bg="blue.50"
                    borderRadius="md"
                    alignItems="center"
                >
                    <Text fontSize="lg" fontWeight="bold">Total Amount:</Text>
                    <Spacer />
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="blue.600"
                    >
                        ₹{totalPrice.toFixed(2)}
                    </Text>
                </Flex>
            )}

            <Box bg="blue.50" p={4} borderRadius="md">
                <FormControl mb={4}>
                    <FormLabel>Scan Barcode/QR Code</FormLabel>
                    <Input
                        type="text"
                        ref={myRef}
                        onKeyDown={handleKeyDown}
                        placeholder="Scan a barcode or QR code"
                        size="lg"
                        bg="white"
                        autoFocus
                    />
                </FormControl>
                <SessionControls />

            </Box>
        </Box>
    )
}