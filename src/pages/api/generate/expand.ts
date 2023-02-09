import axios from 'axios';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  Configuration,
  CreateCompletionResponseUsage,
  OpenAIApi,
} from 'openai';

import { applyMiddleware, getRateLimitMiddlewares } from '@/lib/applyRateLimit';
import { admin } from '@/lib/firebaseAdmin';

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
      return res
        .status(429)
        .json({ message: 'Too Many Requests. Please try again later' });
    }

    try {
      const text = req.body.text;
      const idToken = req.headers.authorization;
      const uid = req.body.uid;

      if (!idToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      let user: DecodedIdToken;
      try {
        user = await admin.auth().verifyIdToken(idToken as string);
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (user.uid != uid) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const docSnap = await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .get();
      const docData = docSnap.data();

      if (!docData) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      let isSubscribed: boolean;

      if (
        docData.subscription.planId == plans.tier1 ||
        docData.subscription.planId == plans.tier2 ||
        docData.subscription.planId == plans.tier3 ||
        docData.subscription.planId == plans.free
      ) {
        isSubscribed = true;
      } else {
        isSubscribed = false;
      }

      if (!isSubscribed) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const currentTokens = docData.subscription.tokens;
      const estimatedTokens = (text.length / 3.8 + 10) * 2;

      if (currentTokens <= estimatedTokens) {
        return res
          .status(400)
          .json({ message: 'You have exceeded your monthly word limit.' });
      }
      const response = await openai.createCompletion({
        model: 'davinci:ft-uplevel-hq-llc-2022-10-23-21-09-05',
        prompt: `${text}\n~~~`,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['==='],
        user: uid,
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
        return res.status(400).json({
          message:
            'AI generated prohibited content. Please try again or try a different selection. Monthly word limit not affected.',
        });
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
      res.status(500).json({ message: 'Unexpected error', error: error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
