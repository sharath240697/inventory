import { Box, Button, Flex, FormControl, FormLabel, Input, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useSearch } from "../../context/SearchContext";
import { Item_t } from "../../../types";
import { useSales } from "../../context/SalesContext";
import { useCallback, useEffect } from "react";
import { useGetApi } from "../../hooks/useGetApi";

export default function SearchTable() {
  const { searchQuery, setSearchQuery, filteredItems, setFilteredItems } = useSearch();
  const { setScannedValue } = useSales();
  
  // Only make the API call when currentSearchQuery is updated
  const { data: searchResults, loading: isSearching } = useGetApi<{ items: Item_t[] }>(
    searchQuery ? `http://localhost:3000/search?searchQuery=${encodeURIComponent(searchQuery)}` : ''
  );

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }
    
    // Update the search query to trigger the API call
    setSearchQuery(searchQuery);
  }, [searchQuery, setFilteredItems]);
  
  // Update filteredItems when search results change
  useEffect(() => {
    if (searchResults) {
      setFilteredItems(searchResults.items || []);
    }
  }, [searchResults, setFilteredItems]);

  // Handle search on key events with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredItems([]);
  };

  const handleAddFromSearch = (item: Item_t) => {
    setScannedValue(prevState => {
      const existingItem = prevState.find(i => i.sku === item.sku)
      if (existingItem) {
        return [
          ...prevState.slice(0, prevState.indexOf(existingItem)),
          {
            ...existingItem,
            quantity: existingItem.quantity + 1,
            price: Math.ceil((existingItem.quantity + 1) * item.sellingPerQuantity)
          },
          ...prevState.slice(prevState.indexOf(existingItem) + 1)
        ]
      }
      return [...prevState, { sku: item.sku, quantity: 1, name: item.name, unitMrp: item.mrpPerQuantity, unitPrice: Math.ceil(item.sellingPerQuantity), price: Math.ceil(item.sellingPerQuantity) }]
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
          isLoading={isSearching}
          loadingText="Searching"
        >
          Search
        </Button>
        <Button
          colorScheme="red"
          onClick={handleClearSearch}
          isDisabled={isSearching}
        >
          Clear
        </Button>
      </Flex>
      {isSearching && <Spinner size="sm" ml={2} />}

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
              <Tr key={item.sku}>
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