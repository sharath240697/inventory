import { Box, Heading, Text } from "@chakra-ui/react";

export default function StoreHeader() {
    return (
        <Box
            textAlign="center"
            bg="gray.50"
            p={6}
            borderRadius="lg"
            shadow="sm"
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={999}
        >
            <Heading size="lg" mb={2}>Spandana Neighbours Store</Heading>
            <Text color="gray.600">#92 Spandanalayam Suvarna Nagar, Bangalore 560073</Text>
            <Text color="gray.500">Tel: +91 8095922403</Text>
        </Box>
    )
}