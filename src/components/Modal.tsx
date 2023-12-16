import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import Todo from '../models/Todo';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const ModalComponent = ({ isModalOpen, handleOk, handleCancel }) => {
  const dispatch = useDispatch();
  const isEdit = useSelector((state) => state.todos.isEdit);

  const [dropdownLabel, setDropdownLabel] = useState('Pendente');


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
      dispatch({ type: 'todos/addTodo', payload: newTodo });
      setNewTodo({
        title: '',
        description: '',
        isCompleted: false,
        imgUrl: '',
      });
      setImageUpload(null);
    }
  };
  

  const editTodo = async (id: number) => {
    console.log(isEdit)
    try {
      dispatch({ type: 'todos/editTodo', payload: id});
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    if (imageUrl) {
      dispatch({ type: 'todos/addTodo', payload: newTodo });
  
      setNewTodo({
        description: '',
        isCompleted: false,
        imgUrl: imageUrl,
      });
      setImageUpload(null);
    }
  }, []);
  
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

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Pendente',
    },
    {
      key: '2',
      label: 'Concluída',
    },
  ];

  const setStatus = (e: any) => {
    e.preventDefault();
    const selectedStatus = e.key;
    console.log(selectedStatus)

    if (selectedStatus === '2') {
      setDropdownLabel('Concluída');
    }
  
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      isCompleted: selectedStatus === '2'
    }));
  };
  

  const onChange: MenuProps['onChange'] = ({ e, key }) => {
    const selectedStatus = e.key;
    console.log(selectedStatus)

    if (selectedStatus === '2') {
      setDropdownLabel('Concluída');
    }
  
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      isCompleted: selectedStatus === '2'
    }));
  };
  
  

  return (
    <Modal title={`${isEdit ? 'Editar' : 'Adicionar'} Tarefa`} open={isModalOpen} onOk={addTodo} onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item label="Descrição" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
          <Input placeholder="Escreva a tarefa" onChange={(e) => setNewTodo((prevTodo) => ({...prevTodo, description: e.target.value}))} />
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please enter a status' }]}>
          <Dropdown menu={{ items, onChange }}>
  <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
    <Space>
      {dropdownLabel}
      <DownOutlined />
    </Space>
  </a>
</Dropdown>

        </Form.Item>

        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Escolher imagem</Button>
        </Upload>
      </Form>
    </Modal>
  );
};

export default ModalComponent;
