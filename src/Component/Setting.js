import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Flex,
  Input,
  useToast,
  FormControl,
  FormLabel,
  InputRightElement,
  IconButton,
  InputGroup,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./All.css";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
const Setting = (props) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [originalUsername, setOriginalUsername] = useState(
    props.userData.username
  );
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // Fetch user details on component mount
  useEffect(() => {
    const savedUsername =
      props.userData?.username || localStorage.getItem("username");
    if (savedUsername) {
      setOriginalUsername(savedUsername);
      setUsername(savedUsername);
    }
    fetchUserDetails(savedUsername);
  }, []);

  const fetchUserDetails = async () => {
    if (!originalUsername) {
      console.error("No username provided for fetching user details");
      console.log(props.userData.username);

      toast({
        title: "Error",
        description: "Username is required to fetch user details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return; // Exit if originalUsername is not set
    }

    try {
      const response = await axios.get(
        `https://mahashaktibackend.onrender.com/api/user-details`,
        {
          params: { username: originalUsername },
        }
      );
      const { name, username } = response.data;

      setName(name);
      setUsername(username);
      setOriginalUsername(username);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put("https://mahashaktibackend.onrender.com/api/login", {
        originalUsername,
        name,
        username,
        password,
      });

      if (response.status === 200) {
        // Update the state with new values
        setOriginalUsername(username);
        setName(name);

        // Save updated username and name in localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("name", name);

        // Notify user of success
        toast({
          title: "Success",
          description: "User details updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Update userData in the parent component (pass both name and username)
        props.updateUserData({ username, name });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      toast({
        title: "Error",
        description: "Failed to update user details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex height="100vh" bg="gray.900">
      <Sidebar onLogout={handleLogout} />
      <Box flex="1" p={10} color="white">
        <Heading mb={6} size="2xl" color="whiteAlpha.900" textAlign="center">
          User Settings
        </Heading>
        <Box bg="gray.700" p={6} borderRadius="md" shadow="md">
          <FormControl mb={4}>
            <FormLabel color="white">Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              size="md"
              bg="gray.600"
              color="white"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel color="white">Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              size="md"
              bg="gray.600"
              color="white"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel color="white">Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                size="md"
                bg="gray.600"
                color="white"
              />
              <InputRightElement width="3rem">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={toggleShowPassword}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "gray.700" }}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button colorScheme="teal" onClick={handleUpdate} size="md" mt={4}>
            Update
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default Setting;
