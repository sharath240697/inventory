import { Box, Flex, Heading, Spacer, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useSales } from "../../context/SalesContext";
import SessionControls from "./SessionControls";
import PurchaseTableWraper from "./PurchaseTableWraper";

export default function Purchase() {
    const { scannedValue, setScannedValue, looseItem, setLooseItem } = useSales();

    const { totalPrice } = useSales();
    return (
        <Box w="48vw">
            <Heading size="md" mb={4}>Purchased Items</Heading>
            <Tabs>
                <TabList>
                    <Tab>Packed Items</Tab>
                    <Tab>Loose Items</Tab>
                </TabList>
                
                <TabPanels>
                    <TabPanel>
                        <PurchaseTableWraper scannedValue={scannedValue} setScannedValue={setScannedValue} />
                    </TabPanel>
                    <TabPanel>
                        <Box p={4}>
                        <PurchaseTableWraper scannedValue={looseItem} setScannedValue={setLooseItem} />
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
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