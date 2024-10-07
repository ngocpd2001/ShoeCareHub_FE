import React, { useEffect, useState } from "react";
import { Badge, Calendar, Card, Modal, List, Typography, Avatar } from "antd";
import { getData } from "../../api/api";
import ComModal from "../ComModal/ComModal";
import { useModalState } from "../../hooks/useModalState";
import DetailEmployee from "../../page/admin/TableEmployee/DetailEmployee";
import ComPhoneConverter from "../ComPhoneConverter/ComPhoneConverter";

const ComCalendar = ({ selectedData, ...props }) => {
  const [employeeSchedule, setEmployeeSchedule] = useState([]);
  const [employeeType, setEmployeeType] = useState([]);
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentYear = String(currentDate.getFullYear());
  const [careMonth, setCareMonth] = useState(currentMonth);
  const [careYear, setCareYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedListData, setSelectedListData] = useState([]);
  const modalDetailUser = useModalState();
  const [selectedUser, setSelectedUser] = useState(null);

  const onPanelChange = (value, mode) => {
    const newMonth = value.format("MM");
    const newYear = value.format("YYYY");
    setCareMonth(newMonth);
    setCareYear(newYear);
  };

  const onSelect = (date) => {
    const listData = getListData(date);
    if (date.format("MM") === careMonth && date.format("YYYY") === careYear) {
      setSelectedDate(date);
      setSelectedListData(listData);
    }
  };

  useEffect(() => {
    const fetchEmployeeType = async () => {
      const response = await getData(`/employee-type`);
      setEmployeeType(response?.data?.contends);
    };
    fetchEmployeeType();
  }, []);

  useEffect(() => {
    const fetchEmployeeSchedule = async () => {
      setEmployeeSchedule([]);
      const response = await getData(
        `/employee-schedule?CareMonth=${careMonth}&CareYear=${careYear}&RoomId=${selectedData.id}`
      );
      setEmployeeSchedule(response?.data?.contends);
      console.log('====================================');
      console.log(selectedData);
      console.log('====================================');
    };
    fetchEmployeeSchedule();
  }, [selectedData, careMonth, careYear]);

  const getListData = (value) => {
    const dateInMonth = value.date();
    let listData = [];
    employeeType.forEach((employee) => {
      employee.monthlyCalendarDetails.forEach((detail) => {
        if (dateInMonth === detail?.monthlyCalendar?.dateInMonth) {
          detail.shifts.forEach((shift) => {
            employeeSchedule.forEach((schedule) => {
              if (schedule.employeeType.name === employee.name) {
                const formatTime = (time) => {
                  const [hour, minute] = time.split(":");
                  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
                };
                listData.push({
                  type: "success",
                  content: `${schedule.user.fullName}`,
                  startTime: formatTime(shift.startTime),
                  endTime: formatTime(shift.endTime),
                  user: schedule.user,
                });
              }
            });
          });
        }
      });
    });

    // Sort by start time first, then by end time
    listData.sort((a, b) => {
      const [startHourA, startMinuteA] = a.startTime.split(":").map(Number);
      const [startHourB, startMinuteB] = b.startTime.split(":").map(Number);
      const [endHourA, endMinuteA] = a.endTime.split(":").map(Number);
      const [endHourB, endMinuteB] = b.endTime.split(":").map(Number);

      if (startHourA !== startHourB) return startHourA - startHourB;
      if (startMinuteA !== startMinuteB) return startMinuteA - startMinuteB;
      if (endHourA !== endHourB) return endHourA - endHourB;
      return endMinuteA - endMinuteB;
    });

    // Group shifts with the same start and end times
    const groupedShifts = [];
    listData.forEach((item) => {
      const existingGroup = groupedShifts.find(
        (group) =>
          group.startTime === item.startTime && group.endTime === item.endTime
      );
      if (existingGroup) {
        existingGroup.content += `, ${item.content}`;
        existingGroup.users.push(item.user);
      } else {
        groupedShifts.push({ ...item, users: [item.user] });
      }
    });

    return groupedShifts;
  };

  const dateCellRender = (value) => {
    if (value.month() + 1 !== parseInt(careMonth)) {
      return null;
    }
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status="success"
              text={`Ca ${index + 1}: ${item.content} (${item.startTime} - ${
                item.endTime
              })`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const showModaldUser = (record) => {
    modalDetailUser.handleOpen();
    setSelectedUser(record);
  };

  return (
    <div className="">
      <Card>
        <Calendar
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
          onSelect={onSelect}
          {...props}
        />
      </Card>
      <Modal
        title={`Chi tiết ca việc ngày ${
          selectedDate ? selectedDate.format("DD-MM-YYYY") : ""
        }`}
        visible={!!selectedDate}
        onCancel={() => setSelectedDate(null)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedListData}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={`Ca ${index + 1} Từ ${item.startTime} đến ${
                  item.endTime
                }`}
                description={
                  <>
                    {item.users.map((user) => (
                      <div key={user.id} className="flex gap-3 items-center">
                        <Avatar src={user.avatarUrl} />
                        <Typography.Link onClick={() => showModaldUser(user)}>
                          {user.fullName}
                        </Typography.Link>
                        <div className="text-black">
                          Số điện thoại:
                          <ComPhoneConverter>
                            {user.phoneNumber}
                          </ComPhoneConverter>
                        </div>
                      </div>
                    ))}
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
      <ComModal
        isOpen={modalDetailUser?.isModalOpen}
        onClose={modalDetailUser?.handleClose}
      >
        <DetailEmployee
          selectedData={selectedUser}
          onClose={modalDetailUser?.handleClose}
        />
      </ComModal>
    </div>
  );
};

export default ComCalendar;
