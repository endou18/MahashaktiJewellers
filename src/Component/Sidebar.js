import { useState } from 'react';
import { 
  Box, VStack, HStack, Icon, Text, Collapse, Divider, 
  Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, 
  Button, useBreakpointValue 
} from '@chakra-ui/react';
import { 
  FaHome, FaProductHunt, FaMoneyBill, FaCog, FaSignOutAlt, 
  FaChevronDown, FaChevronUp, FaBox, FaHistory, FaBars 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenS, setIsOpenS] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleDropdownS = () => setIsOpenS(!isOpenS);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Decide if we are on mobile based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Adjust font sizes for mobile and larger screens
  const fontSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textColor = useBreakpointValue({ base: 'white', md: 'gray.200' });

  // Sidebar content
  const SidebarContent = () => (
    <VStack spacing={6} align="flex-start" color={textColor}>
      <Link to="/dashboard">
        <HStack>
          <Icon as={FaHome} boxSize={6} />
          <Text fontSize={fontSize}>Dashboard</Text>
        </HStack>
      </Link>

      <Box width="100%" onClick={toggleDropdown} cursor="pointer">
        <HStack justify="space-between" width="100%">
          <HStack>
            <Icon as={FaProductHunt} boxSize={6} />
            <Text fontSize={fontSize}>Daily Stocks Management</Text>
          </HStack>
          <Icon as={isOpen ? FaChevronUp : FaChevronDown} />
        </HStack>
        <Collapse in={isOpen} animateOpacity>
          <VStack pl={8} mt={5} align="flex-start" spacing={3}>
            <Link to="/stock-management/todays-stock">
              <HStack>
                <Icon as={FaBox} boxSize={5} />
                <Text fontSize="md">Today's Stock</Text>
              </HStack>
            </Link>
            <Divider borderColor="gray.700" />
            <Link to="/stock-management/stock-history">
              <HStack>
                <Icon as={FaHistory} boxSize={5} />
                <Text fontSize="md">Stock History</Text>
              </HStack>
            </Link>
          </VStack>
        </Collapse>
      </Box>

      <Box width="100%" onClick={toggleDropdownS} cursor="pointer">
        <HStack justify="space-between" width="100%">
          <HStack>
            <Icon as={FaProductHunt} boxSize={6} />
            <Text fontSize={fontSize}>Stock Management</Text>
          </HStack>
          <Icon as={isOpenS ? FaChevronUp : FaChevronDown} />
        </HStack>
        <Collapse in={isOpenS} animateOpacity>
          <VStack pl={8} mt={5} align="flex-start" spacing={3}>
            <Link to="/stock-management/view-stock">
              <HStack>
                <Icon as={FaBox} boxSize={5} />
                <Text fontSize="md">View Stock</Text>
              </HStack>
            </Link>
            <Divider borderColor="gray.700" />
            <Link to="/stock-management/add-stock">
              <HStack>
                <Icon as={FaHistory} boxSize={5} />
                <Text fontSize="md">Add Stock</Text>
              </HStack>
            </Link>
          </VStack>
        </Collapse>
      </Box>

      <Link to="/price-history">
        <HStack>
          <Icon as={FaMoneyBill} boxSize={6} />
          <Text fontSize={fontSize}>Price History</Text>
        </HStack>
      </Link>

      <Link to="/setting">
        <HStack>
          <Icon as={FaCog} boxSize={6} />
          <Text fontSize={fontSize}>Settings</Text>
        </HStack>
      </Link>

      <Divider borderColor="gray.700" />

      <HStack onClick={onLogout} cursor="pointer">
        <Icon as={FaSignOutAlt} boxSize={6} color="red.500" />
        <Text fontSize={fontSize}>Logout</Text>
      </HStack>
    </VStack>
  );

  return (
    <>
      {isMobile ? (
        // Drawer for mobile view
        <>
          <Button onClick={toggleDrawer} bg="gray.800" color="white" p={4} m={2}>
            <Icon as={FaBars} boxSize={6} />
          </Button>

          <Drawer isOpen={isDrawerOpen} placement="left" onClose={toggleDrawer}>
            <DrawerOverlay />
            <DrawerContent bg="gray.900">
              <DrawerCloseButton color="white" />
              <DrawerBody p={4}>
                <SidebarContent />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        // Regular Sidebar for larger screens
        <Box as="nav" bg="gray.900" color="gray.200" height="100vh" width="15vw" p={4} boxShadow="lg">
          <SidebarContent />
        </Box>
      )}
    </>
  );
};

export default Sidebar;
