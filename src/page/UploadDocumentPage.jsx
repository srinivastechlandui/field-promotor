import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaCamera, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import job from '../Assets/jonoprtunity.png';

const UploadDocumentsPage = () => {
  const navigate = useNavigate();
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [activeCamera, setActiveCamera] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleBack = () => navigate(-1);

  const startCamera = (type) => {
    setActiveCamera(type);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Camera error:", err));
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvasRef.current.toDataURL('image/png');
      
      if (activeCamera === 'aadhar-front') setAadharFront(imageDataUrl);
      else if (activeCamera === 'aadhar-back') setAadharBack(imageDataUrl);
      else if (activeCamera === 'pan') setPanCard(imageDataUrl);
      
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setActiveCamera(null);
  };

  const handleFileUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center px-4 py-10"
      style={{ backgroundImage: `url(${job})` }}
    >
      <div className="w-full max-w-md text-white space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="text-white p-2 rounded-full hover:bg-white/20"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold ml-4">Upload Documents</h2>
        </div>

        {/* Camera Modal */}
        {activeCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="max-w-full max-h-[70vh] mb-4"
            />
            <div className="flex space-x-4">
              <button 
                onClick={capturePhoto}
                className="bg-white p-4 rounded-full"
              >
                <FaCamera className="text-black text-xl" />
              </button>
              <button 
                onClick={stopCamera}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Aadhar Card Upload */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white">
          <h3 className="font-semibold mb-4">Upload Aadhar Card</h3>
          <div className="flex space-x-4 mb-4">
            {/* Front Side */}
            <div className="flex-1">
              <div className="h-40 bg-white/20 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                {aadharFront ? (
                  <img src={aadharFront} alt="Aadhar Front" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-white/50">Front Side</span>
                )}
              </div>
              <div className="flex justify-center space-x-2">
                <button 
                  onClick={() => startCamera('aadhar-front')}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                >
                  <FaCamera />
                </button>
                <label className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, setAadharFront)}
                  />
                  <FaUpload />
                </label>
              </div>
            </div>

            {/* Back Side */}
            <div className="flex-1">
              <div className="h-40 bg-white/20 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                {aadharBack ? (
                  <img src={aadharBack} alt="Aadhar Back" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-white/50">Back Side</span>
                )}
              </div>
              <div className="flex justify-center space-x-2">
                <button 
                  onClick={() => startCamera('aadhar-back')}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                >
                  <FaCamera />
                </button>
                <label className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, setAadharBack)}
                  />
                  <FaUpload />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* PAN Card Upload */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white">
          <h3 className="font-semibold mb-4">Upload PAN Card</h3>
          <div className="h-40 bg-white/20 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
            {panCard ? (
              <img src={panCard} alt="PAN Card" className="h-full w-full object-contain" />
            ) : (
              <span className="text-white/50">PAN Card Photo</span>
            )}
          </div>
          <div className="flex justify-center space-x-2">
            <button 
              onClick={() => startCamera('pan')}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
            >
              <FaCamera />
            </button>
            <label className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, setPanCard)}
              />
              <FaUpload />
            </label>
          </div>
        </div>

        {/* Instruction Text */}
        <p className="text-center text-[#EE0303] text-sm mt-2">
          The details on the document should be clearly visible while uploading the picture
        </p>

        {/* Verify Button */}
        <button 
          className={`w-full py-3 px-4 rounded-xl text-white font-bold mt-4 ${
            aadharFront && aadharBack && panCard 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-400/80 cursor-not-allowed'
          }`}
          disabled={!aadharFront || !aadharBack || !panCard}
        >
          VERIFY
        </button>
      </div>

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default UploadDocumentsPage;