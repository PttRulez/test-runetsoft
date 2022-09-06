import { useState } from 'react';

const InputNumber = ({ initValue, idx, changedInput }) => {
  const [value, setValue] = useState(initValue)

  const handleChange = (e) => {
    if (!isNaN(e.target.value)) {
      setValue(e.target.value.trim());
    }
  }

  const handleBlur = (e) => {

    changedInput(idx, Number(e.target.value))
  }

  return <input value={value} onChange={handleChange} onBlur={handleBlur}/>
}

export default InputNumber