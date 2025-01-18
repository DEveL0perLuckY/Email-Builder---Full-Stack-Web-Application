import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import placeholderImg from "../assets/placeholder.jpg";

const EmailEditor = () => {
  const [emailConfig, setEmailConfig] = useState({
    title: "",
    content: "",
    footer: "",
    imageUrl: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3000/email/getEmailLayout").then((res) => {
      console.log(res.data);
    });
  }, []);

  const handleChange = (field, value) => {
    setEmailConfig({ ...emailConfig, [field]: value });
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEmailConfig({ ...emailConfig, imageUrl: previewUrl });
      const formData = new FormData();
      formData.append("image", file);
      try {
        const { data } = await axios.post(
          "http://localhost:3000/email/uploadImage",
          formData
        );
        setEmailConfig({ ...emailConfig, imageUrl: data.imageUrl });
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  const handleSubmit = async () => {
    await axios.post(
      "http://localhost:3000/email/uploadEmailConfig",
      emailConfig
    );
    alert("✅ Email template saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            📧 Email Builder
          </h2>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            💾 Save Template
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          {/* User Input Section */}
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Enter email title..."
              value={emailConfig.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            />

            <label className="block text-gray-700 font-medium mb-2">
              ✍️ Email Content:
            </label>
            <ReactQuill
              value={emailConfig.content}
              onChange={(value) => handleChange("content", value)}
              className="mb-5 bg-white"
              style={{ height: "300px" }} // Increased height
            />

            <label className="block text-gray-700 font-medium mt-4 mb-2">
              🖼️ Upload Image:
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-md"
              >
                <span className="mr-2">📤</span> Upload Image
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter footer text..."
              value={emailConfig.footer}
              onChange={(e) => handleChange("footer", e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mt-4"
            />
          </div>

          {/* Preview Section */}
          <div className="sm:col-span-8 bg-gray-50 p-4 border rounded-lg shadow-md">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">
                {emailConfig.title || "Your Email Title"}
              </h2>
              <div className="my-4">
                <img
                  src={emailConfig.imageUrl || placeholderImg}
                  alt="Uploaded Preview"
                  className="w-full max-h-64 object-contain rounded-md shadow-md border"
                />
              </div>
              <div
                className="text-left border p-3 rounded-md bg-white"
                dangerouslySetInnerHTML={{
                  __html:
                    emailConfig.content || "Start typing your email content...",
                }}
              ></div>
              <p className="mt-4 text-gray-500">
                {emailConfig.footer || "Your email footer text..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
