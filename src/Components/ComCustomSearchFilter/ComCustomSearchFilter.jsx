import React, { useRef, useState } from 'react';
import { Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const CustomSearchFilter = ({ dataIndex, title, handleSearch, handleReset, searchedColumn, searchText }) => {
  const searchInput = useRef(null);

  return (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Input
        ref={searchInput}
        placeholder={`Tìm kiếm ${title}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{
          marginBottom: 8,
          display: 'block',
        }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{
            width: 90,
          }}
        >
          <div className='justify-center flex '><SearchOutlined />Tìm kiếm</div>
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Đặt lại
        </Button>

        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          Đóng
        </Button>
      </Space>
    </div>
  );
};

const getColumnSearchProps = (dataIndex, title) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <CustomSearchFilter
      dataIndex={dataIndex}
      title={title}
      handleSearch={handleSearch}
      handleReset={handleReset}
      searchedColumn={searchedColumn}
      searchText={searchText}
    />
  ),
  filterIcon: (filtered) => (
    <SearchOutlined
      style={{
        color: filtered ? '#1677ff' : undefined,
      }}
    />
  ),
  onFilter: (value, record) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{
          backgroundColor: '#ffc069',
          padding: 0,
        }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
});

export default getColumnSearchProps;
