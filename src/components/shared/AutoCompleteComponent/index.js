import React from 'react'
import { AutoComplete, Input } from 'antd'
import messageReturn from '_helpers/messageReturn'

let handleinput = false
const AutoCompleteComponent = ({ data, width, onSelect, value, onChange, disableInput }) => {
  const handleInputChange = inputValue => {
    onChange(inputValue)
    if (inputValue) {
      handleinput = true
    }
    if (inputValue === '') {
      handleinput = false
    }
  }

  const handleInputBlur = () => {
    if (handleinput) {
      const inputValue = value
      const isValueInList = data.some(option => option.value === inputValue)
      if (!isValueInList) {
        messageReturn(622)
        handleInputChange('')
      }
      handleinput = false
    }
  }

  return (
    <AutoComplete
      style={{ width: `${width}` }}
      options={data}
      value={value}
      onChange={handleInputChange}
      onSelect={(val, option) => onSelect(val, option)}
      // filterOption={() => true}
      filterOption={(inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    >
      <Input placeholder="Select here" onBlur={handleInputBlur} disabled={disableInput} />
    </AutoComplete>
  )
}

export default AutoCompleteComponent

// import React from 'react'
// import { AutoComplete, Input } from 'antd'

// const DropDownComponent = ({ data, width, onSelect, value, onChange }) => {
//   console.log('data', data)
//   return (
//     <AutoComplete
//       style={{ width: `${width}` }}
//       options={data}
//       value={value}
//       onChange={onChange}
//       onSelect={(val, option) => onSelect(val, option)}
//       filterOption={(inputValue, option) =>
//         option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
//       }
//     >
//       <Input placeholder="Select here" />
//     </AutoComplete>
//   )
// }

// export default DropDownComponent

// import React from 'react';
// import { AutoComplete, Input } from 'antd';

// const DropDownComponent = ({ data, width, onSelect, value, onChange }) => {
//   console.log('data', data);

//   const handleInputChange = (inputValue) => {
//     onChange(inputValue);
//   };

//   return (
//     <AutoComplete
//       style={{ width: `${width}` }}
//       options={data}
//       value={value || ' '}
//       onChange={handleInputChange}
//       onSelect={(val, option) => onSelect(val, option)}
//       filterOption={() => true}
//     >
//       <Input placeholder="Select here" />
//     </AutoComplete>
//   );
// };

// export default DropDownComponent;
