import React, { useEffect } from "react";

const GuideModal = ({ onClose }) => {
  useEffect(() => {
    // Khóa scroll khi modal mở
    document.body.style.overflow = "hidden";

    // Mở lại scroll khi modal đóng
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#002278] text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Hướng dẫn gửi khiếu nại</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">
                Bước 1: Tạo khiếu nại mới
              </h4>
              <p>Có 2 cách để tạo khiếu nại:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Cách 1:</strong> Vào trang "Yêu cầu khiếu nại", nhấn
                  vào nút "Tạo khiếu nại mới" ở góc phải màn hình và chọn loại
                  dịch vụ cần khiếu nại
                </li>
                <li>
                  <strong>Cách 2:</strong> Trong trang chi tiết đơn hàng đã hoàn
                  thành, nhấn vào nút "Khiếu nại" để tạo khiếu nại cho đơn hàng
                  đó
                </li>
              </ul>

              <div className="mt-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-700">
                  <strong>Lưu ý về thời hạn khiếu nại dịch vụ:</strong> Bạn chỉ
                  có thể khiếu nại trong vòng 7 ngày kể từ khi đơn hàng hoàn
                  thành. Sau thời gian này, nút "Khiếu nại" sẽ không còn hiển
                  thị và bạn không thể tạo khiếu nại cho đơn hàng này
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">
                Bước 2: Điền thông tin
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Điền tiêu đề mô tả ngắn gọn vấn đề của bạn</li>
                <li>Mô tả chi tiết vấn đề trong phần nội dung</li>
                <li>Đính kèm hình ảnh hoặc tài liệu liên quan (nếu có)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">
                Bước 3: Theo dõi khiếu nại
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Khiếu nại của bạn sẽ được hiển thị trong danh sách với trạng
                  thái "Đang chờ"
                </li>
                <li>
                  Bạn chỉ có thể hủy đơn khiếu nại khi nó ở trạng thái "Đang
                  chờ"
                </li>
                <li>Đơn khiếu nại sẽ được xử lý trong vòng 24 giờ</li>
                <li>
                  Bạn có thể theo dõi tiến độ xử lý thông qua trạng thái khiếu
                  nại
                </li>
                <li>
                  Nhấn vào nút "Xem" để xem chi tiết và tương tác với khiếu nại
                </li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                <strong>Lưu ý:</strong> Vui lòng cung cấp thông tin chính xác và
                đầy đủ để chúng tôi có thể hỗ trợ bạn tốt nhất. Sau khi nhận
                được thông báo qua email về việc đóng đơn khiếu nại, nếu bạn
                không đồng ý với hướng giải quyết, bạn có thể gửi lại phản hồi
                cho ShoeCareHub để chúng tôi có thể hỗ trợ tốt hơn. Hoặc có thể
                liên hệ nhanh với chúng tôi qua <i>HotLine: <u>0123456789</u></i>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
