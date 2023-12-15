import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';

const ModalComponent = ({ isModalOpen, handleOk, handleCancel }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
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
    // Effect to handle imageUrl state update
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
  
      // Check if there's an image upload
      if (imageUpload) {
        // Set newTodo state with the image URL
        await uploadImage();
      } else {
        // No image upload, use values directly
        setNewTodo({ ...values, imgUrl: '' });
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      // Reset form fields and close the modal
      form.resetFields();
      handleOk();
    }
  };
  
  useEffect(() => {
    // This effect runs whenever the imageUrl state is updated
    if (imageUrl) {
      // Dispatch the action with the updated newTodo
      dispatch({ type: 'todos/addTodo', payload: newTodo });
  
      // Reset newTodo state and imageUpload
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
  
      // Wait for the upload to complete
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
    <Modal title="Adicionar Tarefa" open={isModalOpen} onOk={addTodo} onCancel={handleCancel}>
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
