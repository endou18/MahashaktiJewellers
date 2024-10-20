import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Input, InputGroup, InputRightElement, Stack, useToast } from '@chakra-ui/react';
import './LoginPage.css';
import mylogo from '../media/ll.jpg';

const LoginPage = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect to home page if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleClick = () => {
    setShow(!show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });

      if (res.status === 200) {
        const userD = res.data;
        props.onSetData(userD);  // Set user data
        localStorage.setItem('isLoggedIn', 'true');
        toast({
          title: 'Login successful.',
          description: `Welcome, ${userD.name}!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/home', { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid credentials');
        toast({
          title: 'Login failed.',
          description: 'Invalid username or password.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError('An error occurred. Please try again.');
        toast({
          title: 'Error.',
          description: 'An unexpected error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <div className="outer-main-container">
      <div className="inner-main-container">
        <div className="image-logo-container">
          <img src={mylogo} alt="Logo" />
        </div>
        <div className="sign-in-container">
          <h1>Please Login</h1>
          <div className="sign-in-inner">
            <Stack spacing={3}>
              <form onSubmit={handleSubmit}>
                <Input
                  className="username"
                  variant="outline"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Button type="submit" colorScheme="blue">
                  Login
                </Button>
              </form>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
