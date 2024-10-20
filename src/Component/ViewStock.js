import React, { useState, useEffect } from 'react';
import { Box, Heading, Flex, Table, Thead, Tbody, Tr, Th, Td, Input, Button, Select, Text, useToast } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import './All.css';

const ViewStock = (props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  
  // States for filtering by date, type, and item name
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchItemName, setSearchItemName] = useState('');
  
  // States for sorting
  const [sortOption, setSortOption] = useState('itemNameAsc');
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/stocks');
        const data = await response.json();
        setStocks(data);
        setFilteredStocks(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  // Handle filtering and sorting
  const handleFilter = () => {
    let filtered = stocks;

    if (startDate && endDate) {
      filtered = filtered.filter(stock => {
        const stockDate = new Date(stock.date);
        return stockDate >= new Date(startDate) && stockDate <= new Date(endDate);
      });
    }

    if (selectedType) {
      filtered = filtered.filter(stock => stock.type === selectedType);
    }

    if (searchItemName) {
      filtered = filtered.filter(stock =>
        stock.itemname.toLowerCase().includes(searchItemName.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'itemNameAsc':
          return a.itemname.localeCompare(b.itemname);
        case 'itemNameDesc':
          return b.itemname.localeCompare(a.itemname);
        case 'dateAsc':
          return new Date(a.date) - new Date(b.date);
        case 'dateDesc':
          return new Date(b.date) - new Date(a.date);
        case 'allAsc':
          const itemNameComparisonAsc = a.itemname.localeCompare(b.itemname);
          return itemNameComparisonAsc !== 0
            ? itemNameComparisonAsc
            : new Date(a.date) - new Date(b.date);
        case 'allDesc':
          const itemNameComparisonDesc = b.itemname.localeCompare(a.itemname);
          return itemNameComparisonDesc !== 0
            ? itemNameComparisonDesc
            : new Date(b.date) - new Date(a.date);
        default:
          return 0;
      }
    });

    setFilteredStocks(filtered);
  };

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
    handleFilter();
  };

  // Edit button click handler
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData(filteredStocks[index]);
  };

  // Handle editing input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Save the edited data
  const handleUpdate = async () => {
    const updatedData = {
      ...editData,
      author: props.userData.name,
      date: new Date() // Update to the current date and time
    };

    try {
      const response = await fetch(`http://localhost:5000/api/stocks/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updatedStocks = [...stocks];
        updatedStocks[editIndex] = updatedData;
        setStocks(updatedStocks);
        setFilteredStocks(updatedStocks);
        setEditIndex(null);
        setEditData({});
        toast({
          title: "Stock updated.",
          description: "The stock data has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle delete confirmation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/stocks/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const updatedStocks = stocks.filter(stock => stock._id !== id);
          setStocks(updatedStocks);
          setFilteredStocks(updatedStocks);
          toast({
            title: "Stock deleted.",
            description: "The stock data has been successfully deleted.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error('Failed to delete stock');
        }
      } catch (error) {
        console.error('Error deleting stock:', error);
        toast({
          title: "Error",
          description: "Failed to delete stock data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex height="100vh" bg="gray.900">
      <Sidebar onLogout={handleLogout} />

      <Box flex="1" p={10} color="white">
        <Heading mb={6} size="lg" color="whiteAlpha.900" textAlign="center">
          View Stock
        </Heading>

        <Flex mb={6} direction="row" alignItems="center" wrap="nowrap" gap={4}>
          <Input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="md" />
          <Input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} size="md" />
          <Select placeholder="Filter by Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} size="md">
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </Select>
          <Input placeholder="Search by Item Name" value={searchItemName} onChange={(e) => setSearchItemName(e.target.value)} size="md" />
          <Select value={sortOption} onChange={handleSortOptionChange} size="md">
            <option value="itemNameAsc">Item Name (Z-A)</option>
            <option value="itemNameDesc">Item Name (A-Z)</option>
            <option value="dateAsc">Date (Newest First)</option>
            <option value="dateDesc">Date (Oldest First)</option>
            <option value="allAsc">Item Name & Date (A-Z, Newest First)</option>
            <option value="allDesc">Item Name & Date (Z-A, Oldest First)</option>
          </Select>
          <Button colorScheme="teal" onClick={handleFilter} size="md">Filter</Button>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt={8}>
            <div className="custom-loader"></div>
          </Flex>
        ) : (
          filteredStocks.length > 0 && (
            <Box overflowY="auto" maxHeight="80vh">
              <Table variant="simple" mt={8}>
                <Thead>
                  <Tr>
                    <Th color="white">Serial No.</Th>
                    <Th color="white">Type</Th>
                    <Th color="white">Item Name</Th>
                    <Th color="white">Weight</Th>
                    <Th color="white">Pieces</Th>
                    <Th color="white">Date and Time</Th>
                    <Th color="white">Admin By</Th>
                    <Th color="white">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStocks.map((stock, index) => (
                    <Tr key={stock._id}>
                      <Td>{index + 1}</Td>
                      <Td>
                        {editIndex === index ? (
                          <Select
                            name="type"
                            value={editData.type}
                            onChange={handleEditChange}
                            size="sm"
                          >
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                          </Select>
                        ) : (
                          
                          <Button
                      bg={
                        stock.type === "Gold"
                          ? "yellow.500"
                          : "gray.500"
                      }
                      color={stock.type === "Gold" ? "black" : "white"}
                      _hover={{
                        bg:
                          stock.type === "Gold"
                            ? "yellow.600"
                            : "gray.600",
                      }}
                    >
                      {stock.type}
                    </Button>
                        )}
                      </Td>
                      <Td>
                        {editIndex === index ? (
                          <Input
                            name="itemname"
                            value={editData.itemname}
                            onChange={handleEditChange}
                            size="sm"
                          />
                        ) : (
                          stock.itemname
                        )}
                      </Td>
                      <Td>
                        {editIndex === index ? (
                          <Input
                            name="weight"
                            value={editData.weight}
                            onChange={handleEditChange}
                            size="sm"
                          />
                        ) : (
                          stock.weight
                        )}
                      </Td>
                      <Td>
                        {editIndex === index ? (
                          <Input
                            name="pieces"
                            value={editData.pieces}
                            onChange={handleEditChange}
                            size="sm"
                          />
                        ) : (
                          stock.pieces
                        )}
                      </Td>
                      
                      <Td>
                    <Box
                      borderWidth="1px"
                      borderRadius="md"
                      padding="4px 8px"
                      bg="green.700"
                      color="white"
                      textAlign="center"
                    >
                      <Text fontSize="lg" fontWeight="bold">
                        {new Date(stock.date).toLocaleDateString("en-GB", {
                          weekday: "long", // Display full weekday name
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                      <Text fontSize="sm" color="gray.300">
                        {new Date(stock.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </Text>
                    </Box>
                  </Td>
                      <Td>{capitalizeFirstLetter(stock.author)}</Td>
                      <Td>
                        {editIndex === index ? (
                          <Flex gap={2}>
                            <Button colorScheme="green" size="sm" onClick={handleUpdate}>
                              Save
                            </Button>
                            <Button colorScheme="red" size="sm" onClick={() => setEditIndex(null)}>
                              Cancel
                            </Button>
                          </Flex>
                        ) : (
                          <Flex gap={2}>
                            <Button colorScheme="blue" size="sm" onClick={() => handleEdit(index)}>
                              Edit
                            </Button>
                            <Button colorScheme="red" size="sm" onClick={() => handleDelete(stock._id)}>
                              Delete
                            </Button>
                          </Flex>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )
        )}
      </Box>
    </Flex>
  );
};

export default ViewStock;
