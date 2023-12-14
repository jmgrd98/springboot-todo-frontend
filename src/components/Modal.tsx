import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';
import { storage } from '../firebase/firebase';
import {ref, uploadBytes, listAll, getDownloadURL} from 'firebase/storage';

const ModalComponent = ({ isModalOpen, handleOk, handleCancel }) => {

    const [newTodo, setNewTodo] = useState({
      title: '',
      description: '',
      imgUrl: ''
    });
    const [mediaUpload, setImageUpload] = useState(null);

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
        },
      };

      const addTodo = async () => {
        const result = await axios.post("http://localhost:8080/todos");
        console.log(result);
        // setNewTodo(...prevState, result);
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
      <Form.Item label="Título">
        <Input placeholder="Escreva o título" />
      </Form.Item>
      <Form.Item label="Descrição">
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