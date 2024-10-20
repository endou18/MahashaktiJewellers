import { Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <Flex height="100vh" bg="gray.900">
      <Sidebar onLogout={handleLogout} />
      <Dashboard data={props.userData}/>
    </Flex>
  );
};

export default Home;
