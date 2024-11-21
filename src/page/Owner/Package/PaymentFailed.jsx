import React from "react";
import { XCircle, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen  flex  justify-center px-4 sm:px-6 lg:px-8">
      <div className=" w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <div className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thanh toán thất bại
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại .
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center space-y-2">
            <Link
              to="/owner/package"
              className="block font-medium text-red-600 hover:text-red-500"
            >
              Quay lại
            </Link>
            <a
              href="#"
              className="block font-medium text-gray-600 hover:text-gray-500"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
