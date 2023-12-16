import { Select, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Option } = Select;

export default function DropdownComponent() {
  const [items, setItems] = useState(['Pendente', 'Concluída']);

  const addItem = () => {
    console.log('addItem');
    setItems((prevItems) => [...prevItems, `New item ${prevItems.length}`]);
  };

  return (
    <Select
      allowClear
      style={{ width: 240 }}
      placeholder="Pendente"
    >
      {items.map((item) => (
        <Option key={item}>{item}</Option>
      ))}
    </Select>
  );
}
