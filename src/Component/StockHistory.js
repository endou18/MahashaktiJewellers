import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Flex,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Text,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TodaysStock = (props) => {
  const [stockList, setStockList] = useState([]);
  const [filteredStockList, setFilteredStockList] = useState([]); // For filtering the stock
  const [searchProductGivenTo, setSearchProductGivenTo] = useState(""); // New state for search filter
  const [searchItemName, setSearchItemName] = useState(""); // New state for item name search
  const [sortOption, setSortOption] = useState("itemNameAsc"); // Default sorting option
  const [ornamentTypeFilter, setOrnamentTypeFilter] = useState("all"); // State for filtering by Gold/Silver/All
  const [statusFilter, setStatusFilter] = useState("all"); // State for filtering by status
  const [allTodaysHistory, setAllTodaysHistory] = useState([]); // State for all today's history
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  // Fetch data from alltodayshistory API
  const fetchAllTodaysHistoryData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/alltodayshistory"
      );
      setAllTodaysHistory(response.data);
      setFilteredStockList(response.data); // Set full data to filtered list initially
    } catch (error) {
      console.error("Error fetching all today's history data:", error);
    }
  };

  useEffect(() => {
    fetchAllTodaysHistoryData();
  }, []);

  // Filter stocks based on both the "Item Name" and "Product Given To" fields
  const handleSearch = () => {
    let filtered = allTodaysHistory;

    // If the selected sort option is "showAll", don't apply any filtering
    if (sortOption !== "showAll") {
      if (searchItemName) {
        filtered = filtered.filter((stock) =>
          stock.itemName.toLowerCase().includes(searchItemName.toLowerCase())
        );
      }

      if (searchProductGivenTo) {
        filtered = filtered.filter((stock) =>
          stock.productGivenTo
            .toLowerCase()
            .includes(searchProductGivenTo.toLowerCase())
        );
      }

      // Filter by ornament type
      if (ornamentTypeFilter !== "all") {
        filtered = filtered.filter(
          (stock) =>
            stock.ornamentType.toLowerCase() ===
            ornamentTypeFilter.toLowerCase()
        );
      }

      // Filter by status
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (stock) => stock.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // Apply sorting after filtering
      filtered.sort((a, b) => {
        switch (sortOption) {
          case "itemNameAsc":
            return a.itemName
              .toLowerCase()
              .localeCompare(b.itemName.toLowerCase()); // Case-insensitive comparison
          case "itemNameDesc":
            return b.itemName
              .toLowerCase()
              .localeCompare(a.itemName.toLowerCase()); // Case-insensitive comparison
          case "dateAsc":
            return new Date(a.date) - new Date(b.date); // Ascending date comparison
          case "dateDesc":
            return new Date(b.date) - new Date(a.date); // Descending date comparison
          default:
            return 0;
        }
      });
    }

    setFilteredStockList(filtered);
  };

  // Handle sorting/filtering changes
  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
    handleSearch(); // Reapply filtering and sorting when sort option changes
  };

  // Handle ornament type filter change
  const handleOrnamentTypeFilterChange = (e) => {
    setOrnamentTypeFilter(e.target.value);
    handleSearch(); // Reapply filtering when ornament type changes
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    handleSearch(); // Reapply filtering when status changes
  };

  return (
    <Flex height="100vh" bg="gray.900">
      <Sidebar onLogout={handleLogout} />

      <Box flex="1" p={10} color="white">
        <Heading mb={6} size="2xl" color="whiteAlpha.900" textAlign="center">
          All Today's History
        </Heading>

        {/* Search input for both fields */}
        <Flex mb={6} gap={4}>
          <Input
            placeholder="Search by Item Name"
            value={searchItemName}
            onChange={(e) => setSearchItemName(e.target.value)}
            size="md"
            bg="gray.700"
            color="white"
          />
          <Input
            placeholder="Search by Product Given To"
            value={searchProductGivenTo}
            onChange={(e) => setSearchProductGivenTo(e.target.value)}
            size="md"
            bg="gray.700"
            color="white"
          />
          <Select
            value={sortOption}
            onChange={handleSortOptionChange}
            size="md"
            bg="gray.700"
            color="white"
          >
            <option value="itemNameAsc">Item Name (A-Z)</option>
            <option value="itemNameDesc">Item Name (Z-A)</option>
            <option value="dateAsc">Date (Oldest First)</option>
            <option value="dateDesc">Date (Newest First)</option>
          </Select>

          {/* Ornament type filter */}
          <Select
            value={ornamentTypeFilter}
            onChange={handleOrnamentTypeFilterChange}
            size="md"
            bg="gray.700"
            color="white"
          >
            <option value="all">All Types</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </Select>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            size="md"
            bg="gray.700"
            color="white"
          >
            <option value="all">All Status</option>
            <option value="selled">Selled</option>
            <option value="returned">Returned</option>
          </Select>

          <Button
            colorScheme="teal"
            onClick={handleSearch}
            size="md"
            p={6} // Adding padding
            fontSize="lg" // Adjusting font size
            mt={0} // Aligning with inputs
          >
            Search
          </Button>
        </Flex>

        <Box overflowY="auto" maxHeight="80vh">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="white">#</Th>
                <Th color="white">Product Given To</Th>
                <Th color="white">Item Name</Th>
                <Th color="white">Weight (in Grams)</Th>
                <Th color="white">Pieces</Th>
                <Th color="white">Ornament Type</Th>
                <Th color="white">Given Date</Th>
                <Th color="white">Receiving Date</Th>
                <Th color="white">Author</Th>
                <Th color="white">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredStockList.length > 0 ? (
                filteredStockList.map((stock, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{stock.productGivenTo}</Td>
                    <Td>{stock.itemName}</Td>
                    <Td>{stock.weight}</Td>
                    <Td>{stock.pieces}</Td>
                    <Td>
                      <Button
                        bg={
                          stock.ornamentType === "Gold" ? "yellow.500" : "gray.500"
                        }
                        color={
                          stock.ornamentType === "Gold" ? "black" : "white"
                        }
                        _hover={{
                          bg:
                            stock.ornamentType === "Gold"
                              ? "yellow.600"
                              : "gray.600",
                        }}
                      >
                        {stock.ornamentType}
                      </Button>
                    </Td>
                    <Td>
                      <Box
                        borderWidth="1px"
                        borderRadius="md"
                        padding="4px 8px"
                        bg="blue.700"
                        color="white"
                        textAlign="center"
                      >
                        <Text fontSize="lg" fontWeight="bold">
                          {new Date(stock.date).toLocaleDateString("en-GB", {
                            weekday: "long",
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
                          {new Date(stock.deletionDate).toLocaleDateString(
                            "en-GB",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </Text>
                        <Text fontSize="sm" color="gray.300">
                          {new Date(stock.deletionDate).toLocaleTimeString(
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

                    <Td>{capitalizeFirstLetter(stock.author)}</Td>
                    <Td>
                      {stock.status.toLowerCase() === "returned" ? (
                        <Button colorScheme="red" size="sm">
                          Returned
                        </Button>
                      ) : stock.status.toLowerCase() === "selled" ? (
                        <Button colorScheme="green" size="sm">
                          Selled
                        </Button>
                      ) : (
                        <Button colorScheme="gray" size="sm">
                          {capitalizeFirstLetter(stock.status)}
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={9} textAlign="center">
                    No history data available.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
};

export default TodaysStock;
