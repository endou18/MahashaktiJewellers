import { useState } from 'react';
import { Box, VStack, HStack, Icon, Text, Collapse, Divider } from '@chakra-ui/react';
import { FaHome, FaChartLine, FaProductHunt, FaMoneyBill, FaCog, FaSignOutAlt, FaChevronDown, FaChevronUp, FaBox, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenS, setIsOpenS] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdownS = () => {
    setIsOpenS(!isOpenS);
  };

  return (
    <Box
      as="nav"
      bg="gray.900"
      color="gray.200"
      height="100vh"
      width="15vw"
      p={4}
      boxShadow="lg"
    >
      <VStack spacing={6} align="flex-start">
        <Link to="/dashboard">
          <HStack>
            <Icon as={FaHome} boxSize={6} />
            <Text fontSize="lg" whiteSpace="nowrap">Dashboard</Text>
          </HStack>
        </Link>

        <Box width="100%" onClick={toggleDropdown} cursor="pointer">
          <HStack justify="space-between" width="100%">
            <HStack>
              <Icon as={FaProductHunt} boxSize={6} />
              <Text fontSize="lg" whiteSpace="nowrap">Daily Stocks Management</Text>
            </HStack>
            <Icon as={isOpen ? FaChevronUp : FaChevronDown} />
          </HStack>

          <Collapse in={isOpen} animateOpacity>
            <VStack pl={8} mt={5} align="flex-start" spacing={3}>
              <Link to="/stock-management/todays-stock">
                <HStack>
                  <Icon as={FaBox} boxSize={5} />
                  <Text fontSize="md" whiteSpace="nowrap">Today's Stock</Text>
                </HStack>
              </Link>
              <Divider borderColor="gray.700" />
              <Link to="/stock-management/stock-history">
                <HStack>
                  <Icon as={FaHistory} boxSize={5} />
                  <Text fontSize="md" whiteSpace="nowrap">Stock History</Text>
                </HStack>
              </Link>
            </VStack>
          </Collapse>
        </Box>
        <Box width="100%" onClick={toggleDropdownS} cursor="pointer">
          <HStack justify="space-between" width="100%">
            <HStack>
              <Icon as={FaProductHunt} boxSize={6} />
              <Text fontSize="lg" whiteSpace="nowrap">Stock Management</Text>
            </HStack>
            <Icon as={isOpenS ? FaChevronUp : FaChevronDown} />
          </HStack>

          <Collapse in={isOpenS} animateOpacity>
            <VStack pl={8} mt={5} align="flex-start" spacing={3}>
              <Link to="/stock-management/view-stock">
                <HStack>
                  <Icon as={FaBox} boxSize={5} />
                  <Text fontSize="md" whiteSpace="nowrap">View Stock</Text>
                </HStack>
              </Link>
              <Divider borderColor="gray.700" />
              <Link to="/stock-management/add-stock">
                <HStack>
                  <Icon as={FaHistory} boxSize={5} />
                  <Text fontSize="md" whiteSpace="nowrap">Add Stock</Text>
                </HStack>
              </Link>
            </VStack>
          </Collapse>
        </Box>

        

        <Link to="/price-history">
          <HStack>
            <Icon as={FaMoneyBill} boxSize={6} />
            <Text fontSize="lg" whiteSpace="nowrap">Price History</Text>
          </HStack>
        </Link>

        <Link to="/setting">
          <HStack>
            <Icon as={FaCog} boxSize={6} />
            <Text fontSize="lg" whiteSpace="nowrap">Settings</Text>
          </HStack>
        </Link>

        <Divider borderColor="gray.700" />

        <HStack onClick={onLogout} cursor="pointer">
          <Icon as={FaSignOutAlt} boxSize={6} color="red.500" />
          <Text fontSize="lg" whiteSpace="nowrap">Logout</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Sidebar;
