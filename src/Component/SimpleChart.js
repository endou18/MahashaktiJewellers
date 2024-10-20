import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', views: 100 },
  { name: 'Tue', views: 300 },
  { name: 'Wed', views: 200 },
  { name: 'Thu', views: 278 },
  { name: 'Fri', views: 189 },
  { name: 'Sat', views: 239 },
  { name: 'Sun', views: 349 },
];

const SimpleChart = () => (
  <LineChart width={600} height={300} data={data}>
    <Line type="monotone" dataKey="views" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
  </LineChart>
);

export default SimpleChart;
