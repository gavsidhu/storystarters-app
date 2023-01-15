import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  Configuration,
  CreateCompletionResponseUsage,
  OpenAIApi,
} from 'openai';

import { applyMiddleware, getRateLimitMiddlewares } from '@/lib/applyRateLimit';
import { admin } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseClient';

import { plans } from '@/constant/plans';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const middlewares = getRateLimitMiddlewares({ limit: 30 }).map(applyMiddleware);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await Promise.all(middlewares.map((middleware) => middleware(req, res)));
    } catch {
      return res.status(429).send('Too Many Requests. Please try again later');
    }

    try {
      const text = req.body.text;
      const idToken = req.headers.authorization;
      const uid = req.body.uid;

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

      const docSnap = (await getDoc(doc(db, 'users', uid))).data();

      if (!docSnap) {
        throw new Error('User does not exist');
      }

      let isSubscribed: boolean;

      if (
        docSnap.subscription.planId == plans.tier1 ||
        docSnap.subscription.planId == plans.tier2 ||
        docSnap.subscription.planId == plans.tier3
      ) {
        isSubscribed = true;
      } else {
        isSubscribed = false;
      }

      if (!isSubscribed) {
        return res.status(401).send('Unauthorized 4');
      }

      const currentTokens = docSnap.subscription.tokens;
      const estimatedTokens = (text.length / 3.8 + 10) * 2;

      if (currentTokens <= estimatedTokens) {
        return res.status(400).send('You have exceeded your monthly limit');
      }
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt:
          'Rephrase the following text with more detail:\nHe sat on the couch.\n\nHe sank into the couch, his entirety trembling and his eyes wandering between the two windows, anticipating a life-shuttering knock at the door\n---\nRephrase the following text with more detail:\nMichael was terribly afraid of the dark.\n\nAs his mother switched off the light and left the room, Michael tensed. He huddled under the covers, gripped the sheets, and held his breath as the wind brushed past the curtain.\n---\nRephrase the following text with more detail:\n' +
          text,
        temperature: 0.85,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: 'testing',
      });

      const moderationRes = await axios.post(
        'https://api.openai.com/v1/moderations',
        {
          input: response.data.choices[0].text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      if (moderationRes.data.results.flagged === true) {
        return res
          .status(400)
          .send(
            'AI generated prohibited content. Please try again or try a different selection. Monthly word limit not affected.'
          );
      }
      const updatedTokens =
        currentTokens -
        (response.data.usage as CreateCompletionResponseUsage).total_tokens;
      await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .update({ 'subscription.tokens': updatedTokens });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ msg: 'Unexpected error', error: error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
