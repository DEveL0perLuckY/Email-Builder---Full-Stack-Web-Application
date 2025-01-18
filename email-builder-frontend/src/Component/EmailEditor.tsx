import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

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

  const handleChange = (field: string, value: string) => {
    setEmailConfig({ ...emailConfig, [field]: value });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post(
        "http://localhost:3000/email/uploadImage",
        formData
      );
      setEmailConfig({ ...emailConfig, imageUrl: data.imageUrl });
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          📧 Email Builder
        </h2>

        <input
          type="text"
          placeholder="Enter email title..."
          value={emailConfig.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mb-4"
        />
        <label className="block text-gray-700 font-medium mb-2">
          ✍️ Email Content:
        </label>
        <ReactQuill
          value={emailConfig.content}
          onChange={(value) => handleChange("content", value)}
          className="mb-4 bg-white"
        />

        <label className="block text-gray-700 font-medium mt-4">
          🖼️ Upload Image:
        </label>
        <input
          type="file"
          onChange={handleUpload}
          className="mt-2 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {emailConfig.imageUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={emailConfig.imageUrl}
              alt="Uploaded Preview"
              className="w-40 h-40 object-cover rounded-md shadow-md"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Enter footer text..."
          value={emailConfig.footer}
          onChange={(e) => handleChange("footer", e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none mt-4"
        />

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all"
        >
          💾 Save Template
        </button>
      </div>
    </div>
  );
};

export default EmailEditor;
