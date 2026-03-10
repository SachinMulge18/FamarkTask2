/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";

const ContactForm = ({ sessionId }) => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [contactData, setContactData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setFName("");
    setLName("");
    setEmail("");
    setMobile("");
    setEditingId(null);
  };

  const loadContacts = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch("/api/contacts/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage(data.error || "Failed to load contacts");
      } else {
        setContactData(data.contacts || []);
      }
    } catch (error) {
      setMessage("Error loading contacts: " + error.message);
    }
  }, [sessionId]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if(!fName || !lName || !mobile || !email){
        setMessage("Please fill all fields");
        return;
    }

    try {
      if (editingId) {
        const res = await fetch("/api/contacts/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            Business_ContactId: editingId,
            FirstName: fName,
            LastName: lName,
            Phone: mobile,
            Email: email,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setMessage(data.error || "Update failed");
        } else {
          setMessage("Record updated successfully");
          resetForm();
          loadContacts();
        }
      } else {
        const res = await fetch("/api/contacts/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            FirstName: fName,
            LastName: lName,
            Phone: mobile,
            Email: email,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setMessage(data.error || "Create failed");
        } else {
          setMessage("Created RecordId: " + data.contactId);
          resetForm();
          loadContacts();
        }
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact.Business_ContactId);
    setFName(contact.FirstName || "");
    setLName(contact.LastName || "");
    setMobile(contact.Phone || "");
    setEmail(contact.Email || "");
    setMessage("");
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    setMessage("");
    try {
      const res = await fetch("/api/contacts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, Business_ContactId: contactId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessage(data.error || "Delete failed");
      } else {
        setMessage("Record deleted");
        loadContacts();
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 my-3 sm:my-5 rounded-2xl border bg-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-semibold text-center my-3 sm:my-5">
          {editingId ? "Update Contact" : "Contact Form"}
        </h1>
        {message && (
          <p className="text-center text-sm my-2 text-blue-600">{message}</p>
        )}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-5">
          <button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white p-2.5 px-8 rounded-lg cursor-pointer font-medium transition-colors"
            type="submit"
          >
            {editingId ? "Update" : "Submit"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 p-2.5 px-8 rounded-lg cursor-pointer font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Mobile: Card layout */}
      <div className="block sm:hidden space-y-3 my-3">
        {contactData.map((curr) => (
          <div key={curr.Business_ContactId} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base">{curr.FirstName} {curr.LastName}</h3>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Phone:</span> {curr.Phone}</p>
              <p><span className="font-medium text-gray-800">Email:</span> {curr.Email}</p>
              <p className="text-xs text-gray-400 break-all">ID: {curr.Business_ContactId}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(curr)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(curr.Business_ContactId)}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {contactData.length === 0 && (
          <p className="text-center text-gray-400 py-8">No contacts found</p>
        )}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden sm:block overflow-x-scroll">
        <table className="my-5 w-full p-2 border border-gray-200">
          <thead className="border p-1 bg-gray-50">
            <tr>
              <td className="px-2 py-2 font-medium text-sm">ContactId</td>
              <td className="px-2 py-2 font-medium text-sm">FName</td>
              <td className="px-2 py-2 font-medium text-sm">LName</td>
              <td className="px-2 py-2 font-medium text-sm">Phone</td>
              <td className="px-2 py-2 font-medium text-sm">Email</td>
              <td className="px-2 py-2 font-medium text-sm">Actions</td>
            </tr>
          </thead>
          <tbody>
            {contactData.map((curr) => (
              <tr key={curr.Business_ContactId} className="border-t hover:bg-gray-50">
                <td className="px-2 py-2 text-xs">{curr.Business_ContactId}</td>
                <td className="px-2 py-2">{curr.FirstName}</td>
                <td className="px-2 py-2">{curr.LastName}</td>
                <td className="px-2 py-2">{curr.Phone}</td>
                <td className="px-2 py-2">{curr.Email}</td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => handleEdit(curr)}
                    className="bg-yellow-300 hover:bg-yellow-400 px-3 py-1 rounded cursor-pointer text-sm mr-1 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(curr.Business_ContactId)}
                    className="bg-red-300 hover:bg-red-400 px-3 py-1 rounded cursor-pointer text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ContactForm;
