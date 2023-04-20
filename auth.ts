import admin from "firebase-admin";

import serviceAccount from "./accountKeys.json";

export const firebaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
