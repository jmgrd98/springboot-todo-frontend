import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { storage } from '../firebase/firebase';
import {ref, uploadBytes, listAll, getDownloadURL} from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';

const ModalComponent = ({ isModalOpen, handleOk, handleCancel }) => {

  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

    const [newTodo, setNewTodo] = useState({
      title: '',
      description: '',
      imgUrl: ''
    });
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const [form] = Form.useForm();

      const props: any = {
        name: 'file',
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info: any) {
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

      const addTodo = async () => {
        try {
          // Validate the form fields
          const values = await form.validateFields();

          if (imageUpload) {
            await uploadImage();

            setNewTodo({
              title: values.title,
              description: values.description,
              imgUrl: imageUrl,
            });
            console.log(imageUrl)
          }
      
          dispatch({ type: 'todos/addTodo', payload: values });
          form.resetFields();
          handleOk();
        } catch (error) {
          console.error('Error adding todo:', error);
        } finally {
          // Clear newTodo and imageUpload after submitting
          setNewTodo({
            title: '',
            description: '',
            imgUrl: '',
          });
          setImageUpload(null);
        }
      };
      
      

      const uploadImage = async () => {
        try {
          if (!imageUpload) {
            return;
          }
          console.log(imageUpload)
    
          const file = imageUpload.originFileObj;
          console.log(file)
          const storageRef = ref(storage, `images/${file.name}`);
          
    
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          setImageUrl(downloadURL);

          console.log('File uploaded successfully. Download URL:', downloadURL);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }


  return (
    <Modal title="Adicionar Tarefa" open={isModalOpen} onOk={addTodo} onCancel={handleCancel}>
      <Form
      form={form}
    >
      <Form.Item label="Título" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
          <Input placeholder="Escreva o título" />
        </Form.Item>
        <Form.Item label="Descrição" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
          <Input placeholder="Escreva a descrição" />
        </Form.Item>

      <Upload {...props}>
    <Button onClick={uploadImage} icon={<UploadOutlined />}>Escolher imagem</Button>
  </Upload>
    </Form>
      </Modal>
  )
}

export default ModalComponent