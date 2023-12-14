import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { tableStyle, buttonStyle } from './styles';
import { Button, Table, Space } from 'antd';
import ModalComponent from './components/Modal';

function App() {

  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const result = await axios.get("http://localhost:8080/todos");
      setTodos(result.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTodo = async () => {
    showModal();
  };

  const tableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      dataIndex: 'imgUrl',
      key: 'imgUrl'
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button>Concluir</Button>
        </Space>
      ),
    },
  ];

  return (
    <main>
      <Button type="primary" style={buttonStyle} onClick={addTodo}>Adicionar tarefa</Button>
      <Table dataSource={todos} columns={tableColumns} style={tableStyle} />

      <ModalComponent isModalOpen={isModalOpen} handleCancel={handleCancel} handleOk={handleOk} />
    </main>
  )
}

export default App
