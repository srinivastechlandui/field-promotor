/* eslint-disable no-unused-vars */
// src/JobOpportunityPage.js
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { PiWarningCircleFill } from "react-icons/pi";
import job from "../Assets/jonoprtunity.png";
import UserAccessPage from "./UserAccessPage";
import PhotoUploadPage from "./PhotoUploadPage";
import DetailsPage from "./DetailsPage";
import UploadDocumentPage from "./UploadDocumentPage";
const JobOpportunity = () => {
   const [currentPage, setCurrentPage] = useState("main");
  const [activeStep, setActiveStep] = useState(null);
  const steps = [
    { label: "User iD Access", status: "complete" },
    { label: "Profile photo upload", status: "complete" },
    { label: "Details fillup", status: "in-progress" },
    { label: "Documents upload", status: "in-progress" },
    { label: "Onboarding/baground verification fee", status: "pending" },
  ];

    const handleStepClick = (stepIndex) => {
    if (steps[stepIndex].status !== "pending") {
      setActiveStep(stepIndex);
      if (stepIndex === 0) {
        setCurrentPage("userAccess");
      }else if (stepIndex === 1) {
        setCurrentPage("photoUpload");
      }else if (stepIndex === 2) {
        setCurrentPage("details");
      }else if (stepIndex === 3) {
        setCurrentPage("documents");
      }
    }
  };
  if (currentPage === "userAccess") {
    return <UserAccessPage onBack={() => setCurrentPage("main")} />;
  }
   if (currentPage === "photoUpload") {
    return <PhotoUploadPage onBack={() => setCurrentPage("main")} />;
  }
  if (currentPage === "details") {
    return <DetailsPage onBack={() => setCurrentPage("main")} />;
  }
  if (currentPage === "documents") {
    return <UploadDocumentPage onBack={() => setCurrentPage("main")} />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center px-4 py-10"
      style={{ backgroundImage: `url(${job})` }}
    >
        <div className="w-full max-w-md text-white space-y-6">
            {/* Notification Box */}
            <div className="bg-white text-black p-5 rounded-2xl shadow-2xl space-y-3 text-sm">
            <h2 className="text-center font-semibold text-sm">
                Start Earning Now–Limited position jobs Only!
            </h2>
            <p className="text-center text-red-600 font-bold text-sm shadow-sm">
                (Jobs are limited and given on a first-come, first-served basis.)
            </p>
            <div className="flex items-start space-x-2 font-semibold">
                <span>👉</span>
                <p>
                Be among the first to secure your job spot and start getting job
                details!
                </p>
            </div>
            <div className="flex items-start space-x-2 text-black">
                <span>👎</span>
                <p>Once the limit is reached, onboarding access will be closed.</p>
            </div>
            <p className="text-xs text-red-600 flex items-center space-x-2">
                <PiWarningCircleFill className="w-4 h-4 text-red-500" />
                <span>Don't miss out act fast before it's too late!</span>
            </p>
            </div>
            {/* Steps with connecting vertical line */}
            <div className="relative">
                 {steps.length > 1 && (
                <div className="absolute left-6 top-5 bottom-5 w-[2px] bg-gray-300 z-10">
                    <div className="h-full w-full flex flex-col">
                        {steps.slice(0,-1).map((step, index) => {
                            const nextStep = steps[index + 1];
                            if (!nextStep) return null;
                            const lineColor =
                            step.status === "complete" &&
                            (nextStep.status === "complete" ||
                                nextStep.status === "in-progress")
                                ? "bg-green-400"
                                : "bg-pink-400";

                            return (
                            <div key={index} className="flex-1 w-full">
                                <div className={`w-[2px] h-full mx-auto ${lineColor}`} />
                            </div>
                            );
                        })}
                    </div>
                </div>
                 )}
                 {/* Step Items */}
                <div className="relative flex flex-col space-y-5 z-0">
                    {steps.map((step, index) => (
                    <div key={index} onClick={() => handleStepClick(index)}>
                      <StepItem label={step.label} status={step.status} />
                    </div>    
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
const StepItem = ({ label, status }) => {
  const icon = {
    complete: <FaCheckCircle className="text-green-400 w-5 h-5" />,
    "in-progress": (
      <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
    ),
    pending: <FaTimesCircle className="text-red-400 w-5 h-5" />,
  }[status];

  return (
    <div className="relative flex items-center">
      {/* Status Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 bg-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
        {icon}
      </div>

      {/* Step Label Box — THIS IS THE PART TO UPDATE */}
      <div className="flex-1 flex justify-between items-center border border-white rounded-xl pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 transition">
        <span className="text-white font-semibold text-sm">{label}</span>
        <span className="text-white text-lg">{">"}</span>
      </div>
    </div>
  );
};

export default JobOpportunity;
