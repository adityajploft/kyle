import React, {useContext, useEffect, useState} from "react";
import Select from "react-select";

const SingleSelect = ({options,placeholder,name, setValue='', value=''}) => {
  const handleValue = (item) => {
    if(setValue != ''){
      setValue(item);
    }
  }
  
 return (
    <>
      <Select
        name={name}
        defaultValue={[]}
        options={options}
        onChange={(item) => handleValue(item)}
        className="select"
        isClearable={true}
        isSearchable={true}
        isDisabled={false}
        isLoading={false}
        value={value}
        isRtl={false}
        placeholder={placeholder}
        closeMenuOnSelect={true}
      />
    </>
 )
}
export default SingleSelect;