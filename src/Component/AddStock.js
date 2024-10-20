import React, { useState } from 'react';
import { Box, Button, Input, FormLabel, Heading, Flex, Select, useToast } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import axios from 'axios';
import "./All.css"
const AddStock = (props) => {
  const [formData, setFormData] = useState({
    itemname: '',
    weight: '',
    pieces: '',
    type: 'Gold',
    author: ''
  });

  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Validation: Check if required fields are filled
    if (!formData.itemname || !formData.weight) {
      toast({
        title: 'Validation Error',
        description: 'Item Name and Weight are required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; // Prevent form submission if validation fails
    }

    try {
      const response = await axios.post('https://mahashaktibackend.onrender.com/api/add-stock', {
        ...formData,
        date: new Date().toLocaleString(),
        author: props.userData.name,
      });
      if (response.status === 200) {
        toast({
          title: 'Stock added successfully!',
          description: 'Your stock has been added to the inventory.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        // Optionally clear the form here
        setFormData({
          itemname: '',
          weight: '',
          pieces: '',
          type: 'Gold',
          author: ''
        });
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      toast({
        title: 'Error',
        description: 'There was an issue adding the stock.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex height="100vh" bg="gray.900">
      <Sidebar />

      <Box flex="1" p={10} color="white">
        <Heading mb={6} size="lg" color="whiteAlpha.900" textAlign="center">
          Add New Stock
        </Heading>

        <Box>
          <FormLabel>Item Name</FormLabel>
          <Input
            placeholder="Enter item name"
            name="itemname"
            value={formData.itemname}
            onChange={handleChange}
            mb={4}
            isRequired // This ensures the input field is marked as required in the UI
          />

          <FormLabel>Weight</FormLabel>
          <Input
            placeholder="Enter weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            mb={4}
            isRequired // This ensures the input field is marked as required in the UI
          />

          <FormLabel>Pieces</FormLabel>
          <Input
            placeholder="Enter pieces"
            name="pieces"
            value={formData.pieces}
            onChange={handleChange}
            mb={4}
          />

          <FormLabel>Type</FormLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            mb={6}
          >
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </Select>

          <Button colorScheme="teal" onClick={handleSubmit}>
            Add Stock
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default AddStock;
