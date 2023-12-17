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
  handleOk: () => void;
  handleCancel: () => void;
}> = ({ isModalOpen, handleOk, handleCancel }) => {
  const dispatch = useDispatch();
  const isEdit = useSelector((state) => state.todos.isEdit);

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
    async onChange(info) {
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
  
      // setNewTodo({
      //   description: '',
      //   isCompleted: false,
      //   imgUrl: '',
      // });
      setImageUpload(null);
    }
  };

  const editTodo = async (id: number) => {
    console.log(isEdit);
    try {
      dispatch({ type: 'todos/editTodo', payload: id });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal title={`${isEdit ? 'Editar' : 'Adicionar'} Tarefa`} open={isModalOpen} onOk={addTodo} onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item label="Descrição" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
          <Input placeholder="Escreva a tarefa" onChange={(e) => setNewTodo((prevTodo) => ({ ...prevTodo, description: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Status" name="isCompleted" rules={[{ required: false, message: 'Please enter a status' }]}>
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