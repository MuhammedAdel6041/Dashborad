import { Table, Tag, Button } from 'antd';

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'productName',
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => (
      <Tag color={status === 'Ongoing' ? 'green' : status === 'Expired' ? 'red' : 'blue'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Action',
    // eslint-disable-next-line no-unused-vars
    render: (_, record) => (
      <div>
        <Button type="link">Edit</Button>
        <Button type="link" danger>
          Delete
        </Button>
      </div>
    ),
  },
];

const data = [
  {
    key: '1',
    productName: 'T-Shirt',
    startDate: '20-07-2024',
    endDate: '30-07-2024',
    stock: 79,
    status: 'Upcoming',
  },
  // Add more sample data
];

const FlashSales = () => {
  return <Table columns={columns} dataSource={data} />;
};

export default FlashSales;
