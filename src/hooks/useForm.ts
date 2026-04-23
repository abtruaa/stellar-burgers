import { ChangeEvent, useState } from 'react';

export function useForm<T extends Record<string, string>>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };
  const resetForm = () => {
    setValues(inputValues);
  };
  return { values, handleChange, setValues, resetForm };
}
