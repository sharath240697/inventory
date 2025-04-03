import { Badge, Box, Stack } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { useSales } from "../../context/SalesContext";

export default function PriceQRCode() {
    const { totalPrice } = useSales();
    const url = "upi://pay?pa=Q083415724@ybl&pn=PhonePeMerchant&mc=0000&mode=02&purpose=00";

    return (
        <Stack direction="column" w="100%" mt={6} textAlign="center">
            <Box
                bg="white"
                p={4}
                borderRadius="md"
                shadow="sm"
                mx="auto"
                w="fit-content"
            >
                <QRCode
                    value={`${url}&am=${totalPrice}`}
                    size={200}
                />
            </Box>
            <Badge
                colorScheme="green"
                p={2}
                borderRadius="md"
                mx="auto"
            >
                Scan to pay via UPI
            </Badge>
        </Stack>
    )
}   