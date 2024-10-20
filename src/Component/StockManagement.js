import React from 'react';
import { Box, Button, Heading, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const StockManagement = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const handleViewStock = () => {
    navigate('/stock-management/view-stock');
  };

  const handleAddStock = () => {
    navigate('/stock-management/add-stock');
  };

  return (
    <Flex height="100vh" bg="gray.900">
      <Sidebar onLogout={handleLogout} />

      <Box flex="1" p={10} color="white">
        <Heading mb={6} size="lg" color="whiteAlpha.900" textAlign="center">
          Stock Management Dashboard
        </Heading>

        <Flex justifyContent="center" gap={6}>
          <Button
            size="lg"
            colorScheme="blue"
            bg="blue.500"
            _hover={{ bg: 'blue.600' }}
            _focus={{ boxShadow: 'outline' }}
            shadow="md"
            onClick={handleViewStock}
          >
            View Stock
          </Button>

          <Button
            size="lg"
            colorScheme="teal"
            bg="teal.500"
            _hover={{ bg: 'teal.600' }}
            _focus={{ boxShadow: 'outline' }}
            shadow="md"
            onClick={handleAddStock}
          >
            Add Stock
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default StockManagement;
