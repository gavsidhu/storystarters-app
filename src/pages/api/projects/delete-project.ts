import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { NextApiRequest, NextApiResponse } from 'next';

import { admin } from '@/lib/firebaseAdmin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId, uid } = req.body;
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).send('Unauthorized 1');
  }
  let user: DecodedIdToken;
  try {
    user = await admin.auth().verifyIdToken(idToken as string);
  } catch (error) {
    return res.status(401).send('Unauthorized 2');
  }

  if (user.uid != uid) {
    return res.status(401).send('Unauthorized 3');
  }

  try {
    const ref = admin.firestore().collection('projects').doc(projectId);
    await admin.firestore().recursiveDelete(ref);
    res.status(200).json({ msg: 'Succesfully deleted project' });
  } catch (e) {
    res.status(400).json({
      msg: 'Failed to delete project',
    });
  }
}
