// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
// import JobOpportunity from './page/JobOpportunity';
// import PhotoUploadPage from './page/PhotoUploadPage';
// import UserAccessPage from './page/UserAccessPage';
// import DetailsPage from './page/DetailsPage';
// import UploadDocumentPage from './page/UploadDocumentPage';

function App() {
  return (
    
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          {/* <Route path="/" element={<JobOpportunity />} />
          <Route path="/user-access" element={<UserAccessPage />} />
          <Route path="/photo-upload" element={<PhotoUploadPage />} />
          <Route path="/details-fillup" element={<DetailsPage />} />
          <Route path="/upload-documents" element={<UploadDocumentPage />} /> */}
          <Route path="/" element={<Header />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
  
  );
}

export default App;