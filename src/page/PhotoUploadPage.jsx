// src/pages/PhotoUploadPage.js
import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaCamera } from 'react-icons/fa';
import selfi from '../Assets/selfi.png'; // Make sure to import your background image

const PhotoUploadPage = ({onBack}) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      setShowCamera(false);
      
      // Stop camera stream
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center px-4 py-10"
      style={{ backgroundImage: `url(${selfi})` }}
    >
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => onBack()}
            className="text-white p-2 rounded-full hover:bg-white/20"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold ml-4 text-white">Profile Photo Upload</h2>
        </div>

        {/* Photo display area */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-xl shadow-md p-4 mb-6 flex flex-col items-center border border-white">
          {capturedImage ? (
            <div className="relative w-64 h-64 mb-4">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover rounded-full border-4 border-white/30"
              />
            </div>
          ) : showCamera ? (
            <div className="relative w-64 h-64 mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-full border-4 border-white/30"
              />
              <button
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white"
              >
                <FaCamera className="text-gray-700 w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="w-64 h-64 mb-4 flex items-center justify-center rounded-full border-4 border-dashed border-white/30">
              <p className="text-center text-white/80">No photo captured</p>
            </div>
          )}

          {/* "Face should be centered" text */}
          <div className="text-center mb-6">
            <p className="text-white font-medium">Face should be centered</p>
          </div>

          {/* Camera trigger button */}
          {!showCamera && (
            <button
              onClick={startCamera}
              className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white py-2 px-6 rounded-full transition-colors border border-white"
            >
              <FaCamera className="mr-2" />
              Take Photo
            </button>
          )}
        </div>

        {/* Verify button */}
        <button 
          className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-colors ${
            capturedImage ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400/80 cursor-not-allowed'
          }`}
          disabled={!capturedImage}
        >
          VERIFY
        </button>

        {/* Hidden canvas for capturing photo */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PhotoUploadPage;