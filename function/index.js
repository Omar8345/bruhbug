import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { Client, TablesDB, Account } from "node-appwrite";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const appwriteClient = new Client().setProject(
  process.env.APPWRITE_FUNCTION_PROJECT_ID,
);

const allowedOrigins = [
  "https://bruhbug.appwrite.network",
  "http://localhost:8080",
];

async function processRoast(bugDescription) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Roast this bug in 1–2 funny sentences with 1–2 emojis only. 
Bug: "${bugDescription}"`,
        },
      ],
    },
  ];

  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash-lite",
    contents,
  });

  let roast = "";
  for await (const chunk of stream) {
    roast += chunk.text ?? "";
  }

  roast = roast.trim();
  if (!roast) throw new Error("No roast generated");
  return roast;
}

export default async ({ req, res, log, error }) => {
  const origin = req.headers.origin;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return res.json("", 204, headers);
  }

  if (req.method !== "POST") {
    error(405, "Method Not Allowed");
    return res.json({ error: "Method Not Allowed" }, 405, headers);
  }

  if (req.headers["x-appwrite-user-jwt"]) {
    appwriteClient.setJWT(req.headers["x-appwrite-user-jwt"]);
  } else {
    return res.text(
      "Access denied: This function requires authentication. Please sign in to continue.",
      401,
      headers,
    );
  }

  const tablesDB = new TablesDB(appwriteClient);

  const { bugDescription, documentId } = req.bodyJson;

  if (!bugDescription) {
    error(400, "Bad Request: Missing bugDescription");
    return res.json({ error: "Bad Request: Missing bugDescription" }, 400);
  }

  try {
    const roast = await processRoast(bugDescription);
    log(`Generated roast: ${roast}`);

    const account = new Account(appwriteClient);
    const user = await account.get();
    const prefs = user?.prefs || {};
    const username = prefs.username || "@unknown";
    const name = prefs.name || "Anonymous";
    const avatar = prefs.avatar || "";

    const promise = tablesDB.createRow(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_BUGS_COLLECTION_ID,
      documentId,
      {
        userId: req.headers["x-appwrite-user-id"],
        username: username,
        name: name,
        avatar: avatar,
        description: bugDescription,
        roast,
      },
    );

    promise.then(
      function (response) {
        log("Bug report saved successfully:", response);

        return res.json({ documentId }, 200, headers);
      },
      function (error) {
        log("Failed to save bug report:", error);
        return res.json({ error: "Failed to save bug report" }, 500, headers);
      },
    );

    return res.json({ roast }, 200, headers);
  } catch (err) {
    error(err);
    error(500, "Internal Server Error");
    return res.json({ error: "Internal Server Error" }, 500, headers);
  }
};
