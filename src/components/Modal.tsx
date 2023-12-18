import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import Todo from '../models/Todo';
import DropdownComponent from './Dropdown';

const ModalComponent: React.FC<{
  isModalOpen: boolean;
  isEdit: boolean;
  clearForm: boolean;
  todoId: number;
  handleOk: () => void;
  handleCancel: () => void;
}> = ({ isModalOpen, isEdit, clearForm, todoId, handleOk, handleCancel }) => {
  const dispatch = useDispatch();

  const currentTodo: Todo | undefined = useSelector((state: any) => {
    return state.todos.find((todo: Todo) => todo.id === todoId);
  });

  const [newTodo, setNewTodo] = useState<Todo>({
    description: '',
    imgUrl: '',
    isCompleted: false,
  });

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [form] = Form.useForm();

  const props = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    async onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        setImageUpload(info.file);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      setImageUpload(info.file);
      await uploadImage();
    },
  };

  const generateRules = () => {
    if (isEdit) {
      return [];
    }

    return [
      { required: true, message: 'Please enter a description' },
      { required: false, message: 'Please enter a status' }
    ];
  };

  const handleStatusSelect = (selectedStatus: string) => {
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      isCompleted: selectedStatus !== 'Concluída',
    }));
  };

  const uploadImage = async () => {
    const values = await form.validateFields();
    try {
      if (!imageUpload) {
        return;
      }

      const file = imageUpload.originFileObj;
      const storageRef = ref(storage, `images/${file.name}`);

      const uploadTask = uploadBytes(storageRef, file);

      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL);
      setNewTodo({...values, imgUrl: downloadURL});
      console.log('File uploaded successfully. Download URL:', downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const addTodo = async () => {
    try {
      const values = await form.validateFields();
  
        setNewTodo({...values});
        console.log(newTodo)
        dispatch({ type: 'todos/addTodo', payload: newTodo });
      }  catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      form.resetFields();
      handleOk();
      setImageUpload(null);
    }
    handleOk();
  };

  const editTodo = async () => {
    try {
      if (!currentTodo) {
        console.error('Todo not found.');
        return;
      }
  
      const values = await form.validateFields();
  
      const updatedTodo: Todo = {
        ...currentTodo,
        ...values,
      };
  
      dispatch({ type: 'todos/editTodo', payload: updatedTodo });
    } catch (err) {
      console.error(err);
    } finally {
      form.resetFields();
      handleOk();
      setImageUpload(null);
    }
  };
  
  useEffect(() => {
    if (!isModalOpen && clearForm) {
      form.resetFields();
      setNewTodo({
        description: '',
        imgUrl: '',
        isCompleted: false,
      });
    }
  }, [isModalOpen, clearForm, form]);

  return (
    <Modal title={`${isEdit ? 'Editar' : 'Adicionar'} Tarefa`} open={isModalOpen} onOk={isEdit ? () => editTodo(47) : addTodo} onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item label="Descrição" name="description" rules={generateRules()}>
          <Input placeholder="Escreva a tarefa" onChange={(e) => setNewTodo((prevTodo) => ({ ...prevTodo, description: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Status" name="isCompleted" rules={generateRules()}>
          <DropdownComponent onSelect={handleStatusSelect} />
        </Form.Item>

        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Escolher imagem</Button>
        </Upload>
      </Form>
    </Modal>
  );
};

export default ModalComponent;