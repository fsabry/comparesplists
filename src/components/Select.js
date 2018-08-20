import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import * as constants from 'utils/Constants';

const SelectComponent = ({options = [], label = "", onChange}) => {
  return (
    <div className="selectContainer">
      <div className="selectLabel">{label}</div>
      <select onChange={(e) => onChange(e)}>
        <option value="">Choose list below...</option>
        {options.map((optionItem, index) => 
            <option key={index} value={optionItem.value}>{optionItem.label}</option>
        )}
      </select>
    </div>
  );
}

export default SelectComponent;
