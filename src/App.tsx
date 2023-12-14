import './App.css';
import { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';

function App() {

  const [todos, setTodos] = useState([]);

  const fetchData = async () => {
    try {
      const result = await axios.get("http://localhost:8080/todos");
      console.log(result)
      setTodos(result.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
  ];

  return (
    <main>
      <Button type="primary">Adicionar tarefa</Button>
      <Table dataSource={todos} columns={tableColumns} />
    </main>
  )
}

export default App
