import React, {useState} from 'react'
import Select from "react-select";
function MultiSelect({options,placeholder,name, setMultiselectOption, showCreative='', selectValue='', setSelectValues=''}) {    
      const handleSelect = (e) => {
        const selectedValues = Array.isArray(e) ? e.map(x => x.value) : [];
        if(name == 'property_type'){
          if (selectedValues.includes(2) || selectedValues.includes(10) || selectedValues.includes(11) || selectedValues.includes(14) || selectedValues.includes(15)) {
            showCreative(true);
          } else {
            showCreative(false);
          }
        } else if(name == 'purchase_method'){
          if (selectedValues.includes(5)) {
            showCreative(true);
          } else {
            showCreative(false);
          }
        }
        setMultiselectOption(selectedValues);
        if(setSelectValues != ''){
          setSelectValues(e);
        }
    };
    const style = {margin:'auto'};
  return (
    <>
      <Select
        name={name}
        defaultValue={selectValue}
        isMulti
        options={options}
        onChange={handleSelect}
        className="multi-select"
        isClearable={true}
        isSearchable={true}
        isDisabled={false}
        isLoading={false}
        isRtl={false}
        placeholder={placeholder}
        closeMenuOnSelect={false}
        styles={style}
      />
    </>
  )
}

export default MultiSelect