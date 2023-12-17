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

  const handleStatusSelect = (selectedStatus: string) => {
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      isCompleted: selectedStatus === 'Concluída',
    }));
    console.log(newTodo)
  };

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
        description: '',
        isCompleted: false,
        imgUrl: '',
      });
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
    <Modal
      title={`${isEdit ? 'Editar' : 'Adicionar'} Tarefa`}
      visible={isModalOpen}
      onOk={isEdit ? editTodo : addTodo}
      onCancel={handleCancel}
    >
      <Form form={form}>
        <Form.Item
          label="Descrição"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input
            placeholder="Escreva a tarefa"
            onChange={(e) =>
              setNewTodo((prevTodo) => ({ ...prevTodo, description: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please enter a status' }]}
        >
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
