import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

const Resources = ({ courseId, onClose }) => {
  const [resources, setResources] = useState([]);
  const { mode } = useSelector((state) => state.darkMode);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/resource/${courseId}`, {
        withCredentials: true,
      });
      console.log(res.data.resources);
      setResources(res.data.resources);
    } catch (error) {
      console.log(error);
    }
  };

  // Method 1: Enhanced download with proper filename
  const handleDownload = async (resource) => {
    try {
      // Extract filename from title or use a default
      const filename = resource.title.includes('.') 
        ? resource.title 
        : `${resource.title}.pdf`; // Adjust extension as needed
      
      // Create download URL with proper parameters
      const downloadUrl = `${resource.fileUrl}?fl_attachment=${encodeURIComponent(filename)}`;
      
      // Method 1a: Direct download with window.open
      window.open(downloadUrl, '_blank');
      
      // Method 1b: Alternative - create temporary link (uncomment if above doesn't work)
      /*
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      */
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Method 2: Fetch and download (use if Method 1 doesn't work)
  const handleDownloadBlob = async (resource) => {
    try {
      const filename = resource.title.includes('.') 
        ? resource.title 
        : `${resource.title}.pdf`;
      
      // Fetch the file as blob
      const response = await fetch(resource.fileUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="space-y-4 lato-regular max-h-[60vh] overflow-y-auto">
      {resources.length === 0 ? (
        <p className="text-center text-gray-400">No resources found.</p>
      ) : (
        resources.map((res) => (
          <div
            key={res._id}
            className={`p-4 rounded-sm border shadow-sm flex justify-between items-center ${
              mode
                ? "bg-[#1e1e1e] border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <div>
              <h3 className="font-semibold text-md">{res.title}</h3>
              <div className="flex items-center mt-2 gap-2">
                <img
                  src={res.uploadedBy.user.avatar}
                  className="w-6 h-6 rounded-full"
                  alt="Avatar"
                />
                <span className="text-sm">
                  Uploaded by {res.uploadedBy.user.name} ({res.uploadedBy.role})
                </span>
              </div>
            </div>
            
            {/* Method 1: Click handler approach */}
            <button
              onClick={() => handleDownload(res)}
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-3 py-1.5 rounded-sm transition-colors"
            >
              Download
            </button>
            
            {/* Method 2: Direct link approach (alternative - uncomment if needed) */}
            {/*
            <a
              href={`${res.fileUrl}?fl_attachment=${encodeURIComponent(res.title)}`}
              download={res.title}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-3 py-1.5 rounded-sm transition-colors"
            >
              Download
            </a>
            */}
          </div>
        ))
      )}
    </div>
  );
};

export default Resources;
