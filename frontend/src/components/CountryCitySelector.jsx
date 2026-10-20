import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import countryList from 'react-select-country-list';
import cities from 'cities-list';

const { Option } = Select;

const CountryCitySelector = ({ onCountryChange, onCityChange }) => {
  const [countries, setCountries] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  
  useEffect(() => {
    // Load countries
    const countryOptions = countryList().getData();
    setCountries(countryOptions);
  }, []);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    onCountryChange(value);
    onCityChange(''); // Reset city when country changes
    
    // Load cities for the selected country
    if (value) {
      const countryCities = Object.keys(cities).filter(city => 
        cities[city].countryCode === value
      );
      setCitiesList(countryCities);
    } else {
      setCitiesList([]);
    }
  };

  const handleCityChange = (value) => {
    onCityChange(value);
  };

  return (
    <>
      <Form.Item label="Country" name="country" rules={[{ required: true }]}>
        <Select
          showSearch
          placeholder="Select country"
          optionFilterProp="children"
          onChange={handleCountryChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {countries.map(country => (
            <Option key={country.value} value={country.value}>
              {country.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="City" name="city" rules={[{ required: true }]}>
        <Select
          showSearch
          placeholder="Select city"
          disabled={!selectedCountry}
          onChange={handleCityChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {citiesList.map(city => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default CountryCitySelector;