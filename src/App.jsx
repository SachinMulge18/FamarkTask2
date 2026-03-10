import React from "react";
import ContactForm from "./components/ContactForm";
let APIBASE = "https://www.famark.com/Host/api.svc/api/";
// https://www.famark.com/Host/api.svc/api/Business_Contact/RetrieveMultipleRecords
// https://www.famark.com/Host/api.svc/api/Business_Contact/CreateRecord

const App = () => {
  return (
    <div className="container max-w-7xl mx-auto px-5">
      <ContactForm />
    </div>
  );
};

export default App;
