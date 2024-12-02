import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from react-router-dom

function LiveFaceRecognition() {
  const [recognitionResult, setRecognitionResult] = useState(null); // Store recognition result
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [recognizedName, setRecognizedName] = useState(null); // Store the recognized name
  const [isRecognizing, setIsRecognizing] = useState(true); // Flag to control face recognition loop
  const videoRef = useRef(null); // Reference to the video element
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Start webcam stream when the component mounts
  useEffect(() => {
    const startWebcam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Use front-facing camera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    startWebcam();

    // Set up interval to capture image every 3 seconds if face recognition is active
    const intervalId = setInterval(() => {
      if (isRecognizing && !recognitionResult) {
        captureImage();
      }
    }, 3000); // 3 seconds interval

    // Cleanup interval and webcam on component unmount
    return () => {
      clearInterval(intervalId); // Clear interval
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
      }
    };
  }, [recognitionResult, isRecognizing]);

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set the canvas dimensions to match the video feed
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw the current frame from the video to the canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert the image from the canvas to a base64-encoded JPEG
    const imageData = canvas.toDataURL("image/jpeg");

    // Send the base64 image data to the backend (Electron) for recognition
    handleFaceRecognition(imageData);
  };

  const handleFaceRecognition = async (imageData) => {
    try {
      const result = await window.electron.invoke(
        "runFaceRecognition",
        imageData
      );

      if (result === "Unknown") {
        setShowModal(false);
      } else {
        setRecognizedName(result); // Set the recognized name
        setRecognitionResult(result); // Store the recognition result
        setShowModal(true); // Show the modal for confirmation
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
    }
  };

  const handleModalResponse = async (isCorrect) => {
    if (isCorrect) {
      try {
        // Send studentId to the backend
        await window.electron.invoke("updatePresence", {
          studentId: recognizedName.substring(0, 8), // Send the recognized name
        });
        alert("Attendance recorded successfully.");
      } catch (error) {
        console.error("Error updating presence:", error);
        alert(
          error.message || "Failed to record attendance. Please try again."
        );
      }
    }

    // Clear recognition result to continue recognition
    setRecognitionResult(null);
    setShowModal(false); // Hide the modal
  };

  const handleStopRecognition = () => {
    // Stop face recognition and close the webcam
    setIsRecognizing(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
    }

    // Stop the Python face recognition process
    window.electron.invoke("stopFaceRecognition");

    // Navigate back to home page
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Live Face Recognition</h1>
      <video
        ref={videoRef}
        autoPlay
        width="640"
        height="480"
        className="border rounded-lg mb-4"
      />

      {/* Show the recognition result */}
      <div>
        {recognitionResult && (
          <p className="text-lg font-medium">
            Recognition Result: {recognitionResult}
          </p>
        )}
      </div>

      {/* Go Back / Stop Recognition Button */}
      <div className="mt-4">
        <button
          onClick={handleStopRecognition}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none"
        >
          Go Back (Stop Webcam)
        </button>
      </div>

      {/* Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">
              Your name is {recognizedName}. Is this correct?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={() => handleModalResponse(true)}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={() => handleModalResponse(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveFaceRecognition;
