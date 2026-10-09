/* Firestore adapter, reached only when FIREBASE_PROJECT_ID is set.

   Writes the message to `messages` for the record, and a second document to
   `mail`, which is the collection the Firebase Trigger Email extension
   watches. Until EFDA has a role inbox, CONTACT_NOTIFY_TO should point at the
   Program Manager's address.

   firebase-admin is a genuine optional dependency - run `npm install
   firebase-admin` when wiring this up. The specifier is assembled at runtime
   so neither the bundler nor the type checker needs the package to be present
   for the rest of the site to build. */
import type {ContactMessage} from './contact';

/* Just enough of the firebase-admin surface for what is used below. */
interface Credential {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
}
interface AppModule {
  cert(c: Credential): unknown;
  getApps(): unknown[];
  initializeApp(options: {credential: unknown}): unknown;
}
interface DocData {
  [key: string]: unknown;
}
interface FirestoreModule {
  getFirestore(): {
    collection(path: string): {add(data: DocData): Promise<unknown>};
  };
  FieldValue: {serverTimestamp(): unknown};
}

const PKG = 'firebase-admin';

export async function writeToFirestore(m: ContactMessage, subject: string) {
  const {cert, getApps, initializeApp} = (await import(
    /* turbopackIgnore: true */ `${PKG}/app`
  )) as AppModule;
  const {getFirestore, FieldValue} = (await import(
    /* turbopackIgnore: true */ `${PKG}/firestore`
  )) as FirestoreModule;

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Private keys carry literal \n when stored in an env var.
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  }

  const db = getFirestore();

  await db.collection('messages').add({...m, createdAt: FieldValue.serverTimestamp()});

  const to = process.env.CONTACT_NOTIFY_TO;
  if (to) {
    await db.collection('mail').add({
      to,
      replyTo: m.email,
      message: {
        subject,
        text: [
          `Topic: ${m.topic}`,
          `Name: ${m.name}`,
          `Organization: ${m.organization || '-'}`,
          `Email: ${m.email}`,
          `Phone: ${m.phone || '-'}`,
          `Language: ${m.locale}`,
          '',
          m.message
        ].join('\n')
      }
    });
  }
}
