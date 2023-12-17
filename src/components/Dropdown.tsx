import { Select, Divider } from 'antd';
import { useState } from 'react';

const { Option } = Select;

interface DropdownComponentProps {
  onSelect: (value: string) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ onSelect }) => {
  const [items] = useState(['Pendente', 'Concluída']);

  return (
    <Select
      allowClear
      style={{ width: 240 }}
      placeholder="Pendente"
      onChange={(value) => onSelect(value)}
    >
      {items.map((item) => (
        <Option key={item}>{item}</Option>
      ))}
    </Select>
  );
};

export default DropdownComponent;
