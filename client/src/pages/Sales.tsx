import {
  Box,
  Flex,
} from '@chakra-ui/react';
import PriceQRCode from '../components/sales/QRCode';
import StoreHeader from '../components/StoreHeader';
import PurchaseTable from '../components/sales/PurchaseTable';
import SearchTable from '../components/sales/SearchTable';
import CustomerSessionDetails from '../components/sales/CustomerSessionDetails';


const Sales: React.FC = () => {

  return (
    <Box py={5} m={0} w="100vw">
      <StoreHeader />
      <CustomerSessionDetails />

      <Box
        mt={8}
        p={6}
        borderRadius="lg"
        shadow="sm"
        bg="white"
        w="100%"
        mx="auto"
      >
        <Flex direction="row" w="100%" gap={6} mt={4}>
          <PurchaseTable />
          <SearchTable />
        </Flex>
        <PriceQRCode />
      </Box>
    </Box>
  );
};

export default Sales;
