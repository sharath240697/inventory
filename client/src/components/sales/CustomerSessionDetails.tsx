import { Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useSales } from "../../context/SalesContext";

export default function CustomerSessionDetails() {
    const { customerName, setCustomerName, customerMobile, setCustomerMobile } = useSales();


    return (
        <Flex
            mt="10vw"
            direction="row"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            mx="auto"
        >
            <FormControl
                flex={1}
                mr={4}
            >
                <FormLabel textAlign="center">Customer Name</FormLabel>
                <Input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    size="md"
                />
            </FormControl>

            <FormControl
                flex={1}
            >
                <FormLabel textAlign="center">Mobile Number</FormLabel>
                <Input
                    type="tel"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="Enter mobile number"
                    size="md"
                />
            </FormControl>
        </Flex>
    )
}