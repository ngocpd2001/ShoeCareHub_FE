import { useState, useRef } from "react";
import { Input, Space, Button, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";

const { RangePicker } = DatePicker;

const useColumnFilters = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    if (dataIndex === "createdAt") {
      setSearchText(selectedKeys);
    } else {
      setSearchText(selectedKeys[0]);
    }
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="dashed"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            <div className="justify-center flex ">
              <SearchOutlined />
              Tìm kiếm
            </div>
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
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
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#de1818" : "#fff" }} />
    ),
    onFilter: (value, record) => {
      const nestedValue = getNestedValue(record, dataIndex);
      return nestedValue
        ? nestedValue
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase())
        : "";
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      const nestedValue = getNestedValue(record, dataIndex);
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={nestedValue ? nestedValue.toString() : ""}
        />
      ) : (
        nestedValue
      );
    },
  });

 
  const getColumnApprox = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <RangePicker
          onChange={(dates) => {
            setSelectedKeys(
              dates
                ? [dates.map((date) => date.startOf("day").toISOString())]
                : []
            );
          }}
          style={{ marginBottom: 8, display: "block" }}
          format="DD-MM-YYYY"
        />
        <Space>
          <Button
            type="dashed"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            <div className="justify-center flex">
              <SearchOutlined />
              Tìm kiếm
            </div>
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
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#de1818" : "#fff" }} />
    ),
    onFilter: (value, record) => {
      if (!value.length) return true;
      const recordDate = moment(getNestedValue(record, dataIndex)).startOf(
        "day"
      );
      const [start, end] = value;
      return (
        recordDate.isSameOrAfter(moment(start)) &&
        recordDate.isSameOrBefore(moment(end))
      );
    },
    render: (text, record) => {
      const nestedValue = getNestedValue(record, dataIndex);
      return moment(nestedValue).format("DD-MM-YYYY");
    },
  });

  const getColumnApprox1 = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }}>
        <RangePicker
          value={
            selectedKeys[0]
              ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])]
              : []
          }
          onChange={(dates) => {
            setSelectedKeys(
              dates
                ? [dates.map((date) => date.startOf("day").toISOString())]
                : []
            );
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="dashed"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            <div className="justify-center flex">
              <SearchOutlined />
              Tìm kiếm
            </div>
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
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#de1818" : "#fff" }} />
    ),
    onFilter: (value, record) => {
      if (!value.length) return true;
      const recordDate = moment(record[dataIndex]).startOf("day");
      const [start, end] = value;
      return (
        recordDate.isSameOrAfter(moment(start)) &&
        recordDate.isSameOrBefore(moment(end))
      );
    },
  });


  const handleKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    const char = String.fromCharCode(charCode);
    if (!/[0-9]/.test(char)) {
      e.preventDefault();
    }
  };

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (value) => {
    return value.replace(/,/g, "");
  };

  const handleInputChange = (e, setSelectedKeys, index, selectedKeys) => {
    const value = e.target.value;
    const parsedValue = parseNumber(value);
    if (!isNaN(parsedValue)) {
      const newValues = [...(selectedKeys[0] || ["", ""])];
      newValues[index] = parsedValue;
      setSelectedKeys([newValues]);
    }
  };

  const getColumnPriceRangeProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }}>
        <Input.Group compact>
          <Input
            style={{ width: 100, textAlign: "center" }}
            placeholder="Tối thiểu"
            value={selectedKeys[0] ? formatNumber(selectedKeys[0][0]) : ""}
            onChange={(e) =>
              handleInputChange(e, setSelectedKeys, 0, selectedKeys)
            }
            onKeyPress={handleKeyPress}
          />
          <Input
            style={{
              width: 30,
              borderLeft: 0,
              pointerEvents: "none",
              backgroundColor: "#fff",
            }}
            placeholder="~"
            disabled
          />
          <Input
            style={{ width: 100, textAlign: "center", borderLeft: 0 }}
            placeholder="Tối đa"
            value={selectedKeys[0] ? formatNumber(selectedKeys[0][1]) : ""}
            onChange={(e) =>
              handleInputChange(e, setSelectedKeys, 1, selectedKeys)
            }
            onKeyPress={handleKeyPress}
          />
        </Input.Group>
        <Space style={{ marginTop: 8 }}>
          <Button
            type="dashed"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            <div className="justify-center flex">
              <SearchOutlined />
              Tìm kiếm
            </div>
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
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
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#de1818" : "#fff" }} />
    ),
    onFilter: (value, record) => {
      if (!value.length) return true;
      const recordPrice = record[dataIndex];
      const [min, max] = value.map(parseNumber);
      return (
        (min ? recordPrice >= parseFloat(min) : true) &&
        (max ? recordPrice <= parseFloat(max) : true)
      );
    },
    render: (text) => formatNumber(text.toString()),
  });
    const getUniqueValues = (data, key) => {
      const uniqueValues = new Set();
      data.forEach((item) => {
        const value = key
          .split(".")
          .reduce((acc, part) => acc && acc[part], item);
        if (value) uniqueValues.add(value);
      });
      return [...uniqueValues];
    };
  const getColumnFilterProps = (dataIndex, title, uniqueValues) => ({
    filters: uniqueValues.map((value) => ({ text: value, value })),
    onFilter: (value, record) => getNestedValue(record, dataIndex) === value,
    render: (text) => text,
  });

  return {
    getColumnSearchProps,
    getColumnApprox,
    searchText,
    searchedColumn,
    handleSearch,
    handleReset,
    getColumnApprox1,
    getColumnPriceRangeProps,
    getColumnFilterProps,
    getUniqueValues,
  };
};

export default useColumnFilters;
