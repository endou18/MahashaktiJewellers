import React, { useState, useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex, Input, Button, Select, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const PriceHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState(''); // State for selected type
  const [sortOrder, setSortOrder] = useState('desc'); // State for sorting order
  const navigate = useNavigate();

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  // Fetch price history from the backend
  const fetchPriceHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/price-history');
      const data = await response.json();

      // Sort data by updated_at field in descending order (newest first)
      const sortedData = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setHistory(sortedData);
      setFilteredHistory(sortedData); // Initially set the filtered data as the full history
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceHistory();
  }, []);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  // Handle filtering based on selected dates and type
  const handleFilter = () => {
    let filtered = history;

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.updated_at);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });
    }

    // Filter by selected type (Gold/Silver)
    if (selectedType) {
      filtered = filtered.filter(record => record.type === selectedType);
    }

    // Apply sorting after filtering
    if (sortOrder === 'asc') {
      filtered.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
    } else {
      filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }

    setFilteredHistory(filtered);
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    handleFilter(); // Reapply filter after changing sort order
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex>
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <Box flex="1" p={8} bg="gray.800" color="white">
        <Heading mb={6}>Price Update History</Heading>

        {/* Date filter inputs */}
        <Flex mb={6}>
          <Input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            mr={4}
          />
          <Input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            mr={4}
          />

          {/* Dropdown to filter by type */}
          <Select
            placeholder="All"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            mr={4}
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </Select>

          {/* Sort Order Dropdown */}
          <Select value={sortOrder} onChange={handleSortChange} mr={4}>
            <option value="desc">Oldest First</option>
            <option value="asc">Newest First</option>
          </Select>

          <Button colorScheme="teal" onClick={handleFilter}>Filter</Button>
        </Flex>

        {/* History Table with Scrollable Overflow */}
        <Box maxHeight="78vh" overflowY="auto">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="white">#</Th>
                <Th color="white">Type</Th>
                <Th color="white">Price (₹)</Th>
                <Th color="white">Date and Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredHistory.map((record, index) => (
                <Tr key={record._id}>
                  <Td>{index + 1}</Td>
                  
                  <Td>
                  <Button
                        bg={record.type === 'gold' ? 'yellow.500' : 'gray.500'}
                        color={record.type === 'gold' ? 'black' : 'white'}
                        _hover={{ bg: record.type === 'gold' ? 'yellow.600' : 'gray.600' }}
                      >
                        {capitalizeFirstLetter(record.type)}
                      </Button>
                  </Td>
                  <Td>₹{record.price}</Td>

                  <Td>
                    <Box
                      borderWidth="1px"
                      borderRadius="md"
                      padding="4px 8px"
                      bg="cyan.700"
                      color="white"
                      textAlign="center"
                    >
                      <Text fontSize="lg" fontWeight="bold">
                        {new Date(record.updated_at).toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "long", // Display full weekday name
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Text>
                      <Text fontSize="sm" color="gray.300">
                        {new Date(record.updated_at).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )}
                      </Text>
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
};

export default PriceHistory;
