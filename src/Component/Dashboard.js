import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, Flex, Spinner, Button, Input, useToast, Grid } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import "./All.css";

const MotionHeading = motion(Heading);

// 3D Gold Coin Component with Glow Effect
const GoldCoin = () => {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.01)); // Rotate the coin

  return (
    <mesh ref={mesh} scale={3}> {/* Increase the size */}
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <meshStandardMaterial color="gold" emissive="yellow" emissiveIntensity={0.5} /> {/* Add emissive property for glow */}
    </mesh>
  );
};

// 3D Silver Gem Component with Glow Effect
const SilverGem = () => {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.01)); // Rotate the gem

  return (
    <mesh ref={mesh} scale={3}> {/* Increase the size */}
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="silver" emissive="white" emissiveIntensity={0.3} /> {/* Add emissive property for glow */}
    </mesh>
  );
};

const Dashboard = (props) => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [silverPrice, setSilverPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editGoldMode, setEditGoldMode] = useState(false);
  const [editSilverMode, setEditSilverMode] = useState(false);
  const [newGoldPrice, setNewGoldPrice] = useState('');
  const [newSilverPrice, setNewSilverPrice] = useState('');
  const toast = useToast();

  // Fetch the prices from the backend
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://mahashaktibackend.onrender.com/api/prices');
      const data = await response.json();
      setGoldPrice(data.gold_price);
      setSilverPrice(data.silver_price);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update gold price
  const updateGoldPrice = async () => {
    try {
      const response = await fetch('https://mahashaktibackend.onrender.com/api/prices/gold', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gold_price: newGoldPrice || goldPrice }),
      });
      const updatedData = await response.json();
      setGoldPrice(updatedData.gold_price);
      toast({
        title: 'Gold price updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setEditGoldMode(false);
    } catch (error) {
      console.error('Error updating gold price:', error);
      toast({
        title: 'Error updating gold price.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  // Update silver price
  const updateSilverPrice = async () => {
    try {
      const response = await fetch('https://mahashaktibackend.onrender.com/api/prices/silver', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ silver_price: newSilverPrice || silverPrice }),
      });
      const updatedData = await response.json();
      setSilverPrice(updatedData.silver_price);
      toast({
        title: 'Silver price updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setEditSilverMode(false);
    } catch (error) {
      console.error('Error updating silver price:', error);
      toast({
        title: 'Error updating silver price.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch prices on component mount
  useEffect(() => {
    fetchPrices();
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex flex={1} p={5} bg="gray.800" flexDirection="column">
      <MotionHeading
        mb={6}
        color="white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ textShadow: '0px 0px 8px rgba(255, 255, 255, 0.8)' }}
      >
        Welcome, {props.data?.name ? capitalizeFirstLetter(props.data.name) : ''} ✨!!!
      </MotionHeading>

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Flex
          color="white"
          bg="gray.700"
          p={5}
          borderRadius="md"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 0 20px rgba(255, 215, 0, 0.5)" // Glowing effect for gold box
        >
          <Canvas style={{ height: 250, width: 250 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <GoldCoin />
            <OrbitControls />
          </Canvas>
          <Heading size="xl" mt={4}>
            Gold Price: ₹{goldPrice}
          </Heading>
          {editGoldMode ? (
            <Box mt={4} w="100%">
              <Input
                placeholder="Enter new Gold Price"
                mb={2}
                value={newGoldPrice}
                onChange={(e) => setNewGoldPrice(e.target.value)}
                color="white"
                bg="gray.600"
              />
              <Button onClick={updateGoldPrice} colorScheme="teal" mr={2} w="100%">
                Save
              </Button>
              <Button onClick={() => setEditGoldMode(false)} colorScheme="red" w="100%" mt={2}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Button onClick={() => setEditGoldMode(true)} colorScheme="teal" mt={4} w="100%">
              Update Gold Price
            </Button>
          )}
        </Flex>

        <Flex
          color="white"
          bg="gray.700"
          p={5}
          borderRadius="md"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 0 20px rgba(192, 192, 192, 0.5)" // Glowing effect for silver box
        >
          <Canvas style={{ height: 250, width: 250 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <SilverGem />
            <OrbitControls />
          </Canvas>
          <Heading size="xl" mt={4}>
            Silver Price: ₹{silverPrice}
          </Heading>
          {editSilverMode ? (
            <Box mt={4} w="100%">
              <Input
                placeholder="Enter new Silver Price"
                mb={2}
                value={newSilverPrice}
                onChange={(e) => setNewSilverPrice(e.target.value)}
                color="white"
                bg="gray.600"
              />
              <Button onClick={updateSilverPrice} colorScheme="teal" mr={2} w="100%">
                Save
              </Button>
              <Button onClick={() => setEditSilverMode(false)} colorScheme="red" w="100%" mt={2}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Button onClick={() => setEditSilverMode(true)} colorScheme="teal" mt={4} w="100%">
              Update Silver Price
            </Button>
          )}
        </Flex>
      </Grid>
    </Flex>
  );
};

export default Dashboard;
