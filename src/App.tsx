import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Table, Space } from 'antd';
import ModalComponent from './components/Modal';
import { addTodoSuccess, deleteTodoSuccess, fetchTodosSuccess, editTodoSuccess } from './redux/todosSlice';
import './App.css'
import { tableStyle, buttonStyle } from './styles/index';
import { FileImageOutlined, EditOutlined } from '@ant-design/icons';

function App() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [done, setDone] = useState(false);

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

  const editTodo = (updatedTodo) => {
    showModal();
    dispatch(editTodoSuccess(updatedTodo));
    handleOk(); // Close the modal or perform any other necessary actions
  };

  const handleDone = async (record: any) => {
    setDone(true);

    try {
      await axios.put(`http://localhost:8080/todos/${record.id}`)
    } catch (err) {
      console.error(err);
    }
  }

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
      title: 'Imagem',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: (imgUrl) => (
        <a href={imgUrl} target="_blank" rel="noopener noreferrer">
          <FileImageOutlined style={{ fontSize: '25px', cursor: 'pointer' }}  />
        </a>
      ),
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button key={`editar-${record.id}`} onClick={() => editTodo(record)}><EditOutlined /></Button>
          <Button key={`concluir-${record.id}`} onClick={() => handleDone(record)}>{done ? 'Concluída' : 'Concluir'}</Button>
          <Button key={`excluir-${record.id}`} onClick={() => handleDelete(record.id)}>Excluir</Button>
        </Space>
      ),
    },
  ];

  const tableScroll = { x: true };

  return (
    <main>
      <Button type="primary" style={buttonStyle} onClick={addTodo}>
        Adicionar tarefa
      </Button>
      <Table dataSource={todos} columns={tableColumns} style={tableStyle} scroll={tableScroll} />

      <ModalComponent isModalOpen={isModalOpen} handleCancel={handleCancel} handleOk={handleOk} />
    </main>
  );
}

export default App;
