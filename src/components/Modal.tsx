import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';

const ModalComponent = ({ isModalOpen, handleOk, handleCancel }) => {
  const dispatch = useDispatch();
  const isEdit = useSelector((state) => state.todos.isEdit);
  const { TextArea } = Input;

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    imgUrl: ''
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
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      setImageUpload(info.file);
    },
  };

  useEffect(() => {
    if (imageUrl) {
      setNewTodo((prevTodo) => ({
        ...prevTodo,
        imgUrl: imageUrl,
      }));
    }
  }, [imageUrl]);

  const addTodo = async () => {
    try {
      const values = await form.validateFields();
  
      if (imageUpload) {
        await uploadImage();
      } else {
        setNewTodo({ ...values, imgUrl: '' });
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      form.resetFields();
      handleOk();
    }
  };
  
  useEffect(() => {
    if (imageUrl) {
      dispatch({ type: 'todos/addTodo', payload: newTodo });
  
      setNewTodo({
        title: '',
        description: '',
        imgUrl: '',
      });
      setImageUpload(null);
    }
  }, [imageUrl]);
  
  const uploadImage = async () => {
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
  
      console.log('File uploaded successfully. Download URL:', downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  

  return (
    <Modal title={`${isEdit ? 'Adicionar' : 'Editar'} Tarefa`}open={isModalOpen} onOk={addTodo} onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item label="Título" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
          <Input placeholder="Escreva o título" onChange={(e) => setNewTodo({title: e.target.value, description: newTodo.description, imgUrl: newTodo.imgUrl})} />
        </Form.Item>
        <Form.Item label="Descrição" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
          <TextArea rows={4} placeholder="Escreva a descrição" onChange={(e) => setNewTodo({title: newTodo.title, description: e.target.value, imgUrl: newTodo.imgUrl})} />
        </Form.Item>

        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Escolher imagem</Button>
        </Upload>
      </Form>
    </Modal>
  );
};

export default ModalComponent;
