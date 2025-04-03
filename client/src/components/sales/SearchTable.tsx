import { Box, Button, Flex, FormControl, FormLabel, Input, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useSearch } from "../../context/SearchContext";
import { useGetApi } from "../../hooks/useGetApi";
import { Item_t } from "../../../types";
import { useSales } from "../../context/SalesContext";


export default function SearchTable() {
  const { searchQuery, setSearchQuery,
    filteredItems, setFilteredItems
  } = useSearch();
  const { setScannedValue } = useSales();

  const { data: masterData } = useGetApi<{ masterData: Item_t[] }>('http://localhost:3000/masterdata');

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }

    const filtered = masterData?.masterData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    setFilteredItems(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredItems([]);
  };

  const handleAddFromSearch = (item: Item_t) => {
    setScannedValue(prevState => {
      const existingItem = prevState.find(i => i.barcode === item.barcode)
      if (existingItem) {
        return prevState.map(i =>
          i.barcode === item.barcode
            ? {
              ...i, quantity: i.quantity + 1, price: i.price + Math.ceil(item.sellingPerQuantity),
              allowLoose: item.allowLoose
            }
            : i
        )
      }
      return [...prevState, {
        barcode: item.barcode,
        quantity: 1,
        name: item.name,
        unitMrp: item.mrpPerQuantity,
        unitPrice: Math.ceil(item.sellingPerQuantity),
        price: Math.ceil(item.sellingPerQuantity),
        allowLoose: item.allowLoose || false
      }]
    })
  }


  return (
    <Box w="48vw" mr={4}>
      <FormControl mb={4}>
        <FormLabel>Search Items</FormLabel>
        <Input

          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by item name"
          size="md"
          bg="white"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
      </FormControl>

      <Flex direction="row" gap={2} mb={4}>
        <Button
          colorScheme="blue"
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          colorScheme="red"
          onClick={handleClearSearch}
        >
          Clear
        </Button>
      </Flex>

      <Box
        overflowX="auto"
        overflowY="auto"
        maxHeight="400px"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        bg="white"
      >
        <Table variant="simple" size="md">
          <Thead>
            <Tr bg="gray.50">
              <Th>Item</Th>
              <Th isNumeric>MRP</Th>
              <Th isNumeric>Price</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredItems.length === 0 && (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  <Text color="gray.400">Search for items...</Text>
                </Td>
              </Tr>
            )}
            {filteredItems.map((item) => (
              <Tr key={item.barcode}>
                <Td>{item.name}</Td>
                <Td isNumeric>₹{item.mrpPerQuantity}</Td>
                <Td isNumeric>₹{Math.ceil(item.sellingPerQuantity)}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleAddFromSearch(item)}
                  >
                    Add
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
} 