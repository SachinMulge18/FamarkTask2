/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
let APIBASE = "https://www.famark.com/Host/api.svc/api/Business_Contact";

const dummyData = [
  {
    FirstName: "Sachin",
    LastName: "Mulge",
    Phone: "7385950285",
    Email: "sachinmulge98@gmail.com",
    Business_ContactId: "4e876619-7840-48a7-80f9-6e08ae25e2ea",
  },
  {
    FirstName: "Sachin ",
    LastName: "Mulge",
    Phone: "98765456545",
    Email: "sachin98@gmail.com",
    Business_ContactId: "7b4807aa-1c34-4cda-b8a3-77eadc901a1b",
  },
  {
    FirstName: "test",
    LastName: "test",
    Phone: "98765456545",
    Email: "sachin98@gmail.com",
    Business_ContactId: "a897815a-f3dd-461f-bc01-4678b9810f23",
  },
];

const ContactForm = () => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [sessionId, setSessioId] = useState();
  const [contactData, setContactData] = useState(dummyData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!fName || !lName || !mobile || !email){
        return alert("please fill all fields")
    }
    const payload = {
      FirstName: fName,
      LastName: lName,
      Phone: mobile,
      Email: mobile,
    };
    try {
      const res = await fetch(`${APIBASE}/CreateRecord`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert("Something went wrong");
      } else {
        alert("Record created successfully");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  };

  const loadContacts = useCallback(async () => {
    try {
      const res = await fetch(`${APIBASE}/RetrieveMultipleRecords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Columns: "FirstName, LastName, Phone, Email, Business_ContactId",
          OrderBy: "FirstName",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(data.error || "Failed to load contacts");
      } else {
        setContactData(data.contacts || []);
        alert("Contacts loaded successfully!");
      }
    } catch (error) {
      alert("Error loading contacts: " + error.message);
    }
  }, [sessionId]);

  useEffect(() => {
    loadContacts();
  },[]);

  return (
    <>
      <form onSubmit={handleSubmit} className="p-5 my-5 rounded-2xl  border">
        <h1 className="text-2xl text-center my-5 ">Contact Form</h1>
        <div className="flex flex-col fap-1">
          <label htmlFor=""> First Name</label>
          <input
            type="text"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            className="border border-gray-200 p-1 rounded-xl"
          />
        </div>
        <div className="flex flex-col fap-1">
          <label htmlFor="">Last Name</label>
          <input
            type="text"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            className="border border-gray-200 p-1 rounded-xl"
          />
        </div>
        <div className="flex flex-col fap-1">
          <label htmlFor="">Phone</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border border-gray-200 p-1 rounded-xl"
          />
        </div>
        <div className="flex flex-col fap-1">
          <label htmlFor="">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 p-1 rounded-xl"
          />
        </div>

        <button
          className="mx-auto block bg-blue-300 hover:bg-blue-400 p-2 rounded-lg my-5 cursor-pointer"
          type="submit"
        >
          Submit
        </button>
      </form>

      <div className="overflow-x-scroll">
        <table className="my-5 w-full  p-2 border border-gray-200">
          <thead className="border p-1 bg-gray-50">
            <tr>
              <td className="px-2">FName</td>
              <td className="px-2">LName</td>
              <td className="px-2">Phone</td>
              <td className="px-2">Email</td>
            </tr>
          </thead>
          <tbody>
            {contactData.map((curr) => (
              <tr>
                <td className="px-2">{curr.FirstName}</td>
                <td className="px-2">{curr.LastName}</td>
                <td className="px-2">{curr.Phone}</td>
                <td className="px-2">{curr.Email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ContactForm;
