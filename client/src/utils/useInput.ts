import { useState } from 'react'

const useInput = <Type>(initialValue: Type, resetValue: Type) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (event: any) => {
    setValue(event.target.value)
  }

  const reset = () => setValue(resetValue)

  return {
    value,
    onChange: handleChange,
    reset: reset
  }
}

export default useInput