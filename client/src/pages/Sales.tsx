import {
  Box,
  Flex,
} from '@chakra-ui/react';
import PriceQRCode from '../components/sales/QRCode';
import StoreHeader from '../components/StoreHeader';
import SearchTable from '../components/sales/SearchTable';
import CustomerSessionDetails from '../components/sales/CustomerSessionDetails';
import Purchase from '../components/sales/Purchase';


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
          <Purchase />
          <SearchTable />
        </Flex>
        <PriceQRCode />
      </Box>
    </Box>
  );
};

export default Sales;
