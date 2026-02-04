import React from 'react';
import { FEATURE_REGISTRY } from '../features/featureConfig';

interface CardContainerProps {
  category: string;
}

const CardContainer: React.FC<CardContainerProps> = ({ category }) => {
  // BƯỚC 1: Tìm xem category này đã được "đăng ký" code chưa
  const feature = FEATURE_REGISTRY[category];

  // BƯỚC 2: Nếu chưa có (undefined), hiển thị trạng thái "Trống" hoặc "Sắp ra mắt"
  if (!feature) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <span className="text-4xl mb-4">🚧</span>
        <h3 className="text-lg font-bold text-gray-800">Nội dung đang được cập nhật</h3>
        <p className="text-gray-400 text-sm">Chủ đề {category} hiện chưa có dữ liệu ở nhánh này.</p>
      </div>
    );
  }

  // BƯỚC 3: Nếu đã có code, tiến hành lấy data và render
  const { Component, useHook } = feature;
  const { data, loading } = useHook(category);

  if (loading) return <div className="p-10 text-center animate-pulse text-blue-500">Đang tải...</div>;

  if (!data || data.length === 0) {
    return <div className="p-10 text-center text-gray-400">Hiện chưa có bài viết nào.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item: any) => (
        <Component key={item._id} data={item} />
      ))}
    </div>
  );
};

export default CardContainer;