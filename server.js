import express from "express";
import cors from "cors";
import https from "https";

const app = express();
app.use(cors());
app.use(express.json());

function callFamark(path, data, sessionId) {
  return new Promise((resolve, reject) => {
    const body = [];
    const json = JSON.stringify(data);

    const options = {
      hostname: "www.famark.com",
      path: "/Host/api.svc/api" + path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json),
        SessionId: sessionId || "",
      },
    };

    const req = https.request(options, (res) => {
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const error = res.headers["errormessage"];
        if (error) return reject({ error });
        try {
          resolve(JSON.parse(Buffer.concat(body).toString()));
        } catch (e) {
          reject({ error: "Invalid response" });
        }
      });
    });

    req.on("error", (e) => reject({ error: e.message }));
    req.write(json);
    req.end();
  });
}

app.post("/api/login", async (req, res) => {
  try {
    const { DomainName, UserName, Password } = req.body;
    if (!DomainName || !UserName || !Password) {
      return res.status(400).json({ error: "DomainName, UserName and Password are required" });
    }
    const sessionId = await callFamark("/Credential/Connect", {
      DomainName,
      UserName,
      Password,
    });
    res.json({ sessionId });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/api/contacts/create", async (req, res) => {
  try {
    const { sessionId, FirstName, LastName, Phone, Email } = req.body;
    const contactId = await callFamark(
      "/Business_Contact/CreateRecord",
      { FirstName, LastName, Phone, Email },
      sessionId
    );
    res.json({ contactId });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/api/contacts/list", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const contacts = await callFamark(
      "/Business_Contact/RetrieveMultipleRecords",
      {
        Columns: "FirstName, LastName, Phone, Email, Business_ContactId",
        OrderBy: "FirstName",
      },
      sessionId
    );
    res.json({ contacts });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/api/contacts/update", async (req, res) => {
  try {
    const { sessionId, Business_ContactId, FirstName, LastName, Phone, Email } =
      req.body;
    await callFamark(
      "/Business_Contact/UpdateRecord",
      { Business_ContactId, FirstName, LastName, Phone, Email },
      sessionId
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/api/contacts/delete", async (req, res) => {
  try {
    const { sessionId, Business_ContactId } = req.body;
    await callFamark(
      "/Business_Contact/DeleteRecord",
      { Business_ContactId },
      sessionId
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(3001, () => console.log("Server: http://localhost:3001"));
