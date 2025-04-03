import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import PurchaseTable from "./PurchaseTable";
import { useSales } from "../../context/SalesContext";
import SessionControls from "./SessionControls";

export default function Purchase() {

    const { totalPrice } = useSales();
    return (
        <Box w="48vw">
            <Heading size="md" mb={4}>Purchased Items</Heading>
            <PurchaseTable />
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
            <SessionControls />
        </Box>
    )
}