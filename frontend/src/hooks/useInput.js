import { useState } from 'react';

function useInput(defaultValue = '') {
    //siapin state
    const [value, setValue] = useState(defaultValue);
    //handler untuk merubah state
    const onValueChangeHandler = (event) => {
        setValue(event.target.value);
    };
    //return state
    return [value, onValueChangeHandler];
}

//export functinon
export default useInput;