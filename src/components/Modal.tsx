import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';
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
    const [mediaUpload, setImageUpload] = useState(null);
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
          await form.validateFields();
      
          // Get the latest form values
          const formValues = form.getFieldsValue();
      
          // Check if an image was uploaded and set the image URL
          const imgUrl = imageUrl || newTodo.imgUrl;
      
          // Update the newTodo state with the form values and image URL
          setNewTodo({
            ...formValues,
            imgUrl: imgUrl,
          });
      
          // Send the request to add the todo to the server
          dispatch({ type: 'todos/addTodo', payload: newTodo });
      
          // Close the modal after successfully adding the todo
          handleOk();
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      };
      
      

      const uploadImage = async () => {
        try {
          if (!mediaUpload) {
            return;
          }
          console.log(mediaUpload)
    
          const file = mediaUpload.originFileObj;
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
          <Input placeholder="Escreva o título" value={newTodo.title} />
        </Form.Item>
        <Form.Item label="Descrição" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
          <Input placeholder="Escreva a descrição" value={newTodo.description} />
        </Form.Item>

      <Upload {...props}>
    <Button onClick={uploadImage} icon={<UploadOutlined />}>Escolher imagem</Button>
  </Upload>
    </Form>
      </Modal>
  )
}

export default ModalComponent