import React from "react";

const ImageModal = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 font-bold"
        >
          ×
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-[550px] rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;
