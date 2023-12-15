import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Table, Space } from 'antd';
import ModalComponent from './components/Modal';
import { addTodoSuccess, deleteTodoSuccess, fetchTodosSuccess } from './redux/todosSlice';
import './App.css'
import { tableStyle, buttonStyle } from './styles';

function App() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch({ type: 'todos/fetchTodos' });
  }, [dispatch, todos]);

  const handleDelete = (id: number) => {
    dispatch({ type: 'todos/deleteTodo', payload: id });
  };

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
      key: 'imgUrl',
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button key={`concluir-${record.id}`}>Concluir</Button>
          <Button key={`excluir-${record.id}`} onClick={() => handleDelete(record.id)}>Excluir</Button>
        </Space>
      ),
    },
  ];

  return (
    <main>
      <Button type="primary" onClick={addTodo}>
        Adicionar tarefa
      </Button>
      <Table dataSource={todos} columns={tableColumns} />

      <ModalComponent isModalOpen={isModalOpen} handleCancel={handleCancel} handleOk={handleOk} />
    </main>
  );
}

export default App;
