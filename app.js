const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase Admin SDK
// @ts-ignore
// your configuration firebsae account key
const serviceAccount = require("./config/serviceAccountKey.json"); // Replace with your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
// const db = admin.firestore();
// // Load JSON data
const jsonData = JSON.parse(
  // file json exported from realtime database
  fs.readFileSync("note-todo-list-task.json", "utf8")
);

//  json structure data like this {
// "notes": {"1H8G8lrFUJTyvOjJg2Ke2iq6e9x1": { "notes": { "all_notes": {}, "list": {} } }},
// "task": {"2": { "assignedTo": {} }, "3": {"assignedTo": {}}, "4": { "assignedTo": {} }, - "until 500+: { "assignedTo": {} "},
// "users": {"1H8G8lrFUJTyvOjJg2Ke2iq6e9x1": { "displayName" : {} }, "892s2LZQ02Q4bwT5JL8EOBtVDkQ2": { "displayName" : {} }, "AL3ZRRVuuJcyWa7w9njvuX7Gy1l2: { "displayName" : {} }"}
// }

// async function migrateData() {
//   try {
//     // Iterate through the notes in JSON and add them to Firestore
//     for (const userId in jsonData.notes) {
//       const userNotes = jsonData.notes[userId].tasks.all_notes;

//       // Create a Firestore collection for the user
//       const userDocRef = firestore.collection("tasks").doc(userId);

//       for (const noteId in userNotes) {
//         const noteData = userNotes[noteId];
//         await userDocRef.collection("all_notes").doc(noteId).set(noteData);
//         console.log(`Migrated note ${noteId} for user ${userId}`);
//       }
//     }

//     console.log("Data migration completed!");
//   } catch (error) {
//     console.error("Error migrating data:", error);
//   }
// }

// migrateData();

async function migrateData() {
  try {
    const tasksCollection = firestore.collection("users");

    for (const [taskId, taskData] of Object.entries(jsonData.users)) {
      // Add each task as a document in the Firestore collection
      // start from Id 780 til finisihed
      // if (parseInt(taskId) > 680) {
      //   console.log(taskId);
      // }
      await tasksCollection.doc(taskId).set(taskData);
      console.log(`Users ${taskId} successfully added to Firestore.`);
    }
    console.log("All tasks migrated successfully!");
  } catch (error) {
    console.error("Error migrating data to Firestore:", error);
  }
}

migrateData();
