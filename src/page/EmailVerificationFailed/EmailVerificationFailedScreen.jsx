import React from "react";
import { XCircle, RefreshCw, Mail } from "lucide-react";
import { useLocation } from "react-router-dom";
import { postData } from "../../api/api";
import { message } from "antd";

export default function EmailVerificationFailedScreen() {
  const location = useLocation();

  // Tạo instance của URLSearchParams để lấy giá trị query parameter
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("mail");
  console.log("====================================");
  console.log(email);
  console.log("====================================");
  const handleResendVerification = () => {
    // Implement resend verification logic here
    postData("/auth/send-verification-email", {
      email: email,
    })
      .then((e) => {
        message.success(`Gửi lại xác thực mail thành công vui lòng kiểm tra  `);
      })
      .catch((error) => {
        message.error(`Gửi lại xác thực mail không thành công `);
        console.error("1111111 Error fetching items:", error);
      });
    console.log("Resending verification email");
  };

  const handleContactSupport = () => {
    // Implement contact support logic here
    console.log("Contacting support");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Xác thực email không thành công
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Rất tiếc, chúng tôi không thể xác thực địa chỉ email của bạn. Vui lòng
          thử lại hoặc liên hệ với bộ phận hỗ trợ.
        </p>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleResendVerification}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center text-lg font-medium"
          >
            <RefreshCw className="w-6 h-6 mr-2" />
            Gửi lại email xác thực
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 flex items-center justify-center text-lg font-medium"
          >
            <Mail className="w-6 h-6 mr-2" />
            Liên hệ hỗ trợ
          </button>
        </div>

        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Nếu bạn tiếp tục gặp vấn đề, vui lòng kiểm tra hòm thư rác hoặc thử sử
          dụng một địa chỉ email khác.
        </p>
      </div>
    </div>
  );
}
