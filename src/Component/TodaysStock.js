import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CloseIcon, CheckIcon } from "@chakra-ui/icons";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TodaysStock.css"
const TodaysStock = (props) => {
  const [step, setStep] = useState(1);
  const [itemName, setItemName] = useState("");
  const [productGivenTo, setProductGivenTo] = useState("");
  const [weight, setWeight] = useState("");
  const [pieces, setPieces] = useState("");
  const [ornamentType, setOrnamentType] = useState("Gold");
  const [stockList, setStockList] = useState([]);
  const [filteredStockList, setFilteredStockList] = useState([]); // For filtering the stock
  const [searchProductGivenTo, setSearchProductGivenTo] = useState(""); // New state for search filter
  const [searchItemName, setSearchItemName] = useState(""); // New state for item name search
  const [sortOption, setSortOption] = useState("itemNameAsc"); // Default sorting option
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // AlertDialog state
  const [deleteItemId, setDeleteItemId] = useState(null); // Track item to delete
  const [ornamentTypeFilter, setOrnamentTypeFilter] = useState("all");
  const [statusItemId, setStatusItemId] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusChange, setStatusChange] = useState("");
  const cancelRef = useRef(); // For AlertDialog's cancel button
  const toast = useToast();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const handleNext = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    }
  };
  const handleMarkAsSelled = async (deleteItemId) => {
    const stockItemToDelete = stockList.find(
      (item) => item._id === deleteItemId
    );
    stockItemToDelete.status = "Selled";
    console.log(statusChange);
    if (!stockItemToDelete) {
      toast({
        title: "Error",
        description: "Stock item not found.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsStatusDialogOpen(false);
      return;
    }

    try {
      const response = await fetch("https://mahashaktibackend.onrender.com/api/stocks");
      const stocksData = await response.json();
      console.log(stocksData);
      
      // Step 2: Find the matching itemName and type in the fetched stocks
      const matchingStock = stocksData.find(
        (stock) =>
          stock.itemname.toLowerCase() ===
            stockItemToDelete.itemName.toLowerCase() &&
          stock.type.toLowerCase() === stockItemToDelete.ornamentType.toLowerCase() // Ensure the types match
      );

      if (!matchingStock) {
        toast({
          title: "Error",
          description: "Matching stock not found in the main stock list.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Step 3: Subtract the weight and pieces from the matching stock
      const updatedWeight = matchingStock.weight - stockItemToDelete.weight;
      const updatedPieces = matchingStock.pieces - stockItemToDelete.pieces;

      if (updatedWeight < 0 || updatedPieces < 0) {
        toast({
          title: "Error",
          description: "Insufficient stock weight or pieces.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Step 4: Update the stock in the database (using PATCH or PUT)
      await axios.put(`https://mahashaktibackend.onrender.com/api/stocks/${matchingStock._id}`, {
        weight: updatedWeight,
        pieces: updatedPieces, // Update both weight and pieces
      });

      // First, store the deleted item in the "AllTodaysHistory" collection
      await storeInAllTodaysHistory(stockItemToDelete);

      // Then, delete the item from "Today's Stock" if the history is stored successfully
      await axios.delete(
        `https://mahashaktibackend.onrender.com/api/todays-stock/${deleteItemId}`
      );

      toast({
        title: "Selled",
        description: "Stock item selled successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsStatusDialogOpen(false); // Close the dialog
      fetchStockData(); // Refresh data
    } catch (error) {
      console.error("Error Selling stock item:", error);
      toast({
        title: "Error",
        description:
          "Failed to store history or delete the stock item. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(
        "https://mahashaktibackend.onrender.com/api/todays-stock"
      );
      setStockList(response.data);
      setFilteredStockList(response.data); // Set initial filtered data
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleSubmit = async () => {
    if (!itemName || !productGivenTo || !weight) {
      toast({
        title: "Error",
        description: "Item Name, Product Given To, and Weight are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newStock = {
      itemName,
      productGivenTo,
      weight,
      pieces: pieces || 0,
      ornamentType,
      date: new Date().toISOString(),
      author: props.userData.name,
    };

    try {
      await axios.post("https://mahashaktibackend.onrender.com/api/todays-stock", newStock);
      toast({
        title: "Success",
        description: "Stock added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setItemName("");
      setProductGivenTo("");
      setWeight("");
      setPieces("");
      setOrnamentType("Gold");
      fetchStockData();
    } catch (error) {
      console.error("Error adding stock:", error);
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  const storeInAllTodaysHistory = async (stockItem) => {
    const historyItem = {
      itemName: stockItem.itemName,
      productGivenTo: stockItem.productGivenTo,
      weight: stockItem.weight,
      pieces: stockItem.pieces,
      ornamentType: stockItem.ornamentType,
      date: stockItem.date,
      author: stockItem.author,
      status: stockItem.status,
      deletionDate: new Date().toISOString(), // Track when the item was deleted
    };

    try {
      // Using a relative URL path for axios
      await axios.post(
        "https://mahashaktibackend.onrender.com/api/alltodayshistory",
        historyItem
      );
      console.log("Stock item stored in AllTodaysHistory successfully.");

      toast({
        title: "Success",
        description: "Stock item history stored successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error storing stock item in AllTodaysHistory:", error);

      // Show a toast notification with error details
      toast({
        title: "Error",
        description: `Failed to store history: ${
          error.response?.data?.message || error.message
        }`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle deletion with confirmation
  const handleDelete = async () => {
    const stockItemToDelete = stockList.find(
      (item) => item._id === deleteItemId
    );
    stockItemToDelete.status = "Returned";
    console.log(statusChange);

    if (!stockItemToDelete) {
      toast({
        title: "Error",
        description: "Stock item not found.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      // First, store the deleted item in the "AllTodaysHistory" collection
      await storeInAllTodaysHistory(stockItemToDelete);

      // Then, delete the item from "Today's Stock" if the history is stored successfully
      await axios.delete(
        `https://mahashaktibackend.onrender.com/api/todays-stock/${deleteItemId}`
      );

      toast({
        title: "Deleted",
        description: "Stock item deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsDeleteDialogOpen(false); // Close the dialog
      fetchStockData(); // Refresh data
    } catch (error) {
      console.error("Error deleting stock item:", error);
      toast({
        title: "Error",
        description:
          "Failed to store history or delete the stock item. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Open the delete confirmation dialog
  const openDeleteDialog = (itemId) => {
    setDeleteItemId(itemId);
    setIsDeleteDialogOpen(true);
  };

  // Close the delete confirmation dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const openStatusDialog = (itemId) => {
    setStatusItemId(itemId);
    setIsStatusDialogOpen(true);
  };

  const closeStatusDialog = () => {
    setIsStatusDialogOpen(false);
  };
  // Filter stocks based on both the "Item Name" and "Product Given To" fields
  const handleSearch = () => {
    let filtered = stockList;

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
          stock.ornamentType.toLowerCase() === ornamentTypeFilter.toLowerCase()
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

    setFilteredStockList(filtered);
  };

  // Handle sorting changes
  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
    handleSearch(); // Reapply filtering and sorting when sort option changes
  };
  const handleOrnamentTypeFilterChange = (e) => {
    setOrnamentTypeFilter(e.target.value);
    handleSearch(); // Reapply filtering when ornament type changes
  };
  return (
    <Flex height="100vh" bg="gray.900">
      <Sidebar onLogout={handleLogout} />

      <Box flex="1" p={10} color="white" overflowY="auto">
        <Heading mb={6} size="2xl" color="whiteAlpha.900" textAlign="center">
          Today's Stock
        </Heading>

        <Box mb={6} p={6} bg="gray.800" borderRadius="md" shadow="md">
          {/* Flex container for input fields */}
          {isMobile && (
        <Flex direction="column" gap={4} alignItems="center">
          {step === 1 && (
            <FormControl isRequired width="80%">
              <FormLabel>Item Name</FormLabel>
              <Input
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                bg="gray.700"
                color="white"
              />
              <Button colorScheme="blue" onClick={handleNext} mt={4}>
                Next
              </Button>
            </FormControl>
          )}

          {step === 2 && (
            <FormControl isRequired width="80%">
              <FormLabel>Product Given To</FormLabel>
              <Input
                placeholder="Enter product given to"
                value={productGivenTo}
                onChange={(e) => setProductGivenTo(e.target.value)}
                bg="gray.700"
                color="white"
              />
              <Button colorScheme="blue" onClick={handleNext} mt={4}>
                Next
              </Button>
            </FormControl>
          )}

          {step === 3 && (
            <FormControl isRequired width="80%">
              <FormLabel>Weight</FormLabel>
              <Input
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                bg="gray.700"
                color="white"
              />
              <Button colorScheme="blue" onClick={handleNext} mt={4}>
                Next
              </Button>
            </FormControl>
          )}

          {step === 4 && (
            <FormControl width="80%">
              <FormLabel>Pieces</FormLabel>
              <Input
                type="number"
                placeholder="Enter number of pieces"
                value={pieces}
                onChange={(e) => setPieces(e.target.value)}
                bg="gray.700"
                color="white"
              />
              <Button colorScheme="blue" onClick={handleNext} mt={4}>
                Next
              </Button>
            </FormControl>
          )}

          {step === 5 && (
            <FormControl width="80%">
              <FormLabel>Type of Ornaments</FormLabel>
              <Select
                value={ornamentType}
                onChange={(e) => setOrnamentType(e.target.value)}
                bg="gray.700"
                color="white"
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </Select>
              <Button colorScheme="blue" onClick={handleNext} mt={4}>
                Next
              </Button>
            </FormControl>
          )}

          {step === 6 && (
            <Button colorScheme="blue" onClick={handleSubmit} mt={8}>
              Submit
            </Button>
          )}
        </Flex>
      )}

      {!isMobile && (
        <Flex direction="row" gap={4} alignItems="center">
          <FormControl isRequired width="20%">
            <FormLabel>Item Name</FormLabel>
            <Input
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              bg="gray.700"
              color="white"
            />
          </FormControl>

          <FormControl isRequired width="20%">
            <FormLabel>Product Given To</FormLabel>
            <Input
              placeholder="Enter product given to"
              value={productGivenTo}
              onChange={(e) => setProductGivenTo(e.target.value)}
              bg="gray.700"
              color="white"
            />
          </FormControl>

          <FormControl isRequired width="15%">
            <FormLabel>Weight</FormLabel>
            <Input
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              bg="gray.700"
              color="white"
            />
          </FormControl>

          <FormControl width="15%">
            <FormLabel>Pieces</FormLabel>
            <Input
              type="number"
              placeholder="Enter number of pieces"
              value={pieces}
              onChange={(e) => setPieces(e.target.value)}
              bg="gray.700"
              color="white"
            />
          </FormControl>

          <FormControl width="15%">
            <FormLabel>Type of Ornaments</FormLabel>
            <Select
              value={ornamentType}
              onChange={(e) => setOrnamentType(e.target.value)}
              bg="gray.700"
              color="white"
            >
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </Select>
          </FormControl>

          <Button colorScheme="blue" onClick={handleSubmit} mt={8}>
            Submit
          </Button>
        </Flex>
      )}
        </Box>

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

        <Box className="tableContainer">
        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead className="tableHeader">
            <Tr>
              <Th color="white">#</Th>
              <Th color="white">Product Given To</Th>
              <Th color="white">Item Name</Th>
              <Th color="white">Weight (in Grams)</Th>
              <Th color="white">Pieces</Th>
              <Th color="white">Ornament Type</Th>
              <Th color="white">Date</Th>
              <Th color="white">Author</Th>
              <Th color="white">Actions</Th> {/* New column for actions */}
            </Tr>
          </Thead>
          <Tbody>
            {filteredStockList.length > 0 ? (
              filteredStockList.map((stock, index) => (
                <Tr key={index} className="tableRow`">
                  <Td>{index + 1}</Td>
                  <Td>{capitalizeFirstLetter(stock.productGivenTo)}</Td>
                  <Td>{stock.itemName}</Td>
                  <Td>{stock.weight}</Td>
                  <Td>{stock.pieces}</Td>

                  <Td>
                    <Button
                      bg={
                        stock.ornamentType === "Gold"
                          ? "yellow.500"
                          : "gray.500"
                      }
                      color={stock.ornamentType === "Gold" ? "black" : "white"}
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
                    {/* Delete button */}
                    <IconButton
                      icon={<CloseIcon />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => openDeleteDialog(stock._id)}
                      aria-label="Delete"
                    />
                    <IconButton
                      aria-label="Mark as Selled"
                      icon={<CheckIcon />}
                      size="sm"
                      marginLeft={2}
                      colorScheme="green"
                      onClick={() => openStatusDialog(stock._id)}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={9} textAlign="center">
                  No stock data available.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        </Box>
      </Box>
      <AlertDialog
        isOpen={isStatusDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeStatusDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Mark as Selled
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to mark this stock item as "Selled"?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeStatusDialog}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={() => handleMarkAsSelled(statusItemId)}
                ml={3}
              >
                Mark as Selled
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* Chakra UI AlertDialog for delete confirmation */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Stock Item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this stock item? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default TodaysStock;
