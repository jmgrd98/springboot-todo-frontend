import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Table, Space } from 'antd';
import ModalComponent from './components/Modal';
import { addTodoSuccess, deleteTodoSuccess, fetchTodosSuccess, editTodoSuccess, setEditStatus } from './redux/todosSlice';
import './App.css'
import { tableStyle, buttonStyle } from './styles/index';
import { FileImageOutlined, EditOutlined } from '@ant-design/icons';
import Todo from './models/Todo';

function App() {
  const dispatch = useDispatch();
  const todos: Todo[] = useSelector((state) => {
    if (state.todos.length > 0) {
      return state.todos;
    }
    return state.todos.list;
  });
  const isEdit = useSelector((state) => state.todos.isEdit);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'todos/fetchTodos' });
  }, [dispatch, todos]);

  const handleDelete = (id: number) => {
    dispatch({ type: 'todos/deleteTodo', payload: id });
  };

  const editTodo = async () => {
    dispatch({ type: 'todos/setEditStatus', payload: true});
    setIsModalOpen(true);
    console.log(isEdit);
  };

  const handleDone = async (record: Todo) => {
    try {
      const updatedTodo = { ...record, isCompleted: !record.isCompleted };
      await axios.put(`http://localhost:8080/todos/${record.id}`, updatedTodo);
      dispatch({ type: 'todos/editTodo', payload: updatedTodo });
    } catch (err) {
      console.error(err);
    }
  };

  const tableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'isCompleted',
      key: 'isCompleted',
    },
    {
      title: 'Imagem',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: (imgUrl: string) => (
        <a href={imgUrl} target="_blank" rel="noopener noreferrer">
          <FileImageOutlined style={{ fontSize: '25px', cursor: 'pointer' }}  />
        </a>
      ),
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_: any, record: Todo) => (
        <Space size="middle">
          <Button key={`editar-${record.id}`} onClick={() => editTodo()}><EditOutlined /></Button>
          <Button key={`concluir-${record.id}`} onClick={() => handleDone(record)}>{record.isCompleted ? 'Concluída' : 'Concluir'}</Button>
          <Button key={`excluir-${record.id}`} onClick={() => handleDelete(record.id)}>Excluir</Button>
        </Space>
      ),
    },
  ];

  const tableScroll = { x: true };

  return (
    <main>
      <Button type="primary" style={buttonStyle} onClick={() => setIsModalOpen(true)}>
        Adicionar tarefa
      </Button>
      <Table dataSource={todos} columns={tableColumns} style={tableStyle} scroll={tableScroll} />

      <ModalComponent isModalOpen={isModalOpen} handleCancel={() => setIsModalOpen(false)} handleOk={() => setIsModalOpen(false)} />
    </main>
  );
}

export default App;
