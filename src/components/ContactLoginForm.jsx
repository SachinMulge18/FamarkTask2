/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const ContactLoginForm = ({ onLogin }) => {
  const [domain, setDomain] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = {
      DomainName: domain,
      UserName: userName,
      Password: passWord,
    };
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessage(data.error || "Login failed");
      } else {
        onLogin(data.sessionId);
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col min-h-[80vh] px-2">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-5">Famark Cloud Login</h1>
        {message && <p className="text-red-500 mb-3 text-sm text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-medium text-gray-700">Domain name</label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-medium text-gray-700">UserName</label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={passWord}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg mt-4 font-medium cursor-pointer transition-colors"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactLoginForm;
