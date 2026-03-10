import React, { useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactLoginForm from "./components/ContactLoginForm";

const App = () => {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5">
      {!sessionId ? (
        <ContactLoginForm onLogin={setSessionId} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 my-3 sm:my-4 p-3 bg-gray-100 rounded-lg">
            <span className="text-xs sm:text-sm text-gray-600 truncate w-full sm:max-w-md break-all">
              SessionId: {sessionId}
            </span>
            <button
              onClick={() => setSessionId(null)}
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg cursor-pointer text-sm w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
          <ContactForm sessionId={sessionId} />
        </>
      )}
    </div>
  );
};

export default App;
