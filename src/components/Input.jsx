import { useState, useRef } from 'react';

const applyMask = (value, mask) => {
  const cleanValue = value.replace(/\D/g, '');
  let maskedValue = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (valueIndex >= cleanValue.length) break;

    if (mask[i] === '#') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[i];
    }
  }
  return maskedValue;
};

export const useInput = (initialValue = '', mask = null) => {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(null);

  const handleChange = (e) => {
    let newValue = e.target.value;

    if (mask) {
      newValue = applyMask(newValue, mask);
    }

    setValue(newValue);
  };

  return [
    {
      value,
      onChange: handleChange,
      ref,
    },
    setValue,
  ];
};
