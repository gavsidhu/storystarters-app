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
      return res.status(429).send('Too Many Requests. Please try again later');
    }

    try {
      const idToken = req.headers.authorization;
      const uid = req.body.uid;
      const genre = req.body.genre;
      const role = req.body.role;
      const plot = req.body.plot;

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

      const docSnap = await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .get();
      const docData = docSnap.data();

      if (!docData) {
        throw new Error('User does not exist');
      }

      let isSubscribed: boolean;

      if (
        docData.subscription.planId == plans.tier1 ||
        docData.subscription.planId == plans.tier2 ||
        docData.subscription.planId == plans.tier3
      ) {
        isSubscribed = true;
      } else {
        isSubscribed = false;
      }

      if (!isSubscribed) {
        return res.status(401).send('Unauthorized 4');
      }

      const currentTokens = docData.subscription.tokens;
      const estimatedTokens = (200 / 3.8 + 10) * 2;

      if (currentTokens <= estimatedTokens) {
        return res.status(400).send('You have exceeded your monthly limit');
      }
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: generatePlot(plot, genre, role),
        temperature: 0.7,
        max_tokens: 759,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['==='],
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

function generatePlot(plot: string, genre: string, role: string) {
  return `create a character based on the following information:
plot: The circumstances surrounding the death of crime novelist Harlan Thrombey are mysterious, but there's one thing that renowned Detective Benoit Blanc knows for sure -- everyone in the wildly dysfunctional Thrombey family is a suspect. Now, Blanc must sift through a web of lies and red herrings to uncover the truth.
genre: mystery
role: tertiary character
~~~
Name: Marie Thrombey

Age: 45

Appearance: Marie is an attractive woman in her mid-forties with shoulder-length curly brown hair, bright green eyes and light freckles on her cheeks. She is usually dressed in a smart business outfit with a pencil skirt, a fitted blouse and a blazer.

Background: Marie is the youngest daughter of Harlan Thrombey and the only sibling to remain close with him until his untimely death. She works as a public relations specialist for a large technology company, but she always finds time to visit her father and catch up on his latest projects.

Personality: Marie is a bubbly and outgoing person who loves to talk and connect with people. She is highly intelligent and well-spoken, with a sharp wit and an eye for detail. She is also fiercely loyal to her family, and her father's death has left her shaken and determined to uncover the truth.

Role: Marie is a tertiary character in the mystery plot. She is an important part of the Thrombey family, and Detective Benoit Blanc will rely on her to provide an insider's perspective and help him uncover the truth.

Motivation: Marie will do whatever it takes to get to the bottom of her father's death, and she is willing to put her own reputation and safety on the line to get justice for her father.

Occupation: Marie is a public relations specialist for a large technology company.

Flaws: Marie can be too trusting, which can get her into trouble when she's looking into her father's death. She also has a tendency to be too outspoken and direct, which can rub people the wrong way.
===
create a character based on the following information:
plot: The circumstances surrounding the death of crime novelist Harlan Thrombey are mysterious, but there's one thing that renowned Detective Benoit Blanc knows for sure -- everyone in the wildly dysfunctional Thrombey family is a suspect. Now, Blanc must sift through a web of lies and red herrings to uncover the truth.
genre: mystery
role: protaganist
~~~
Name: Benoit Blanc

Age: 55

Appearance: Benoit is an imposing figure with a tall, muscular build, square jaw and piercing blue eyes. He usually wears a well-tailored suit and a trench coat, and he keeps his hair cut short. 

Background: Benoit is a renowned detective who has solved numerous cases in his long career. He has a reputation for being able to get to the bottom of even the most complex cases, and his services have been requested by the Thrombey family to investigate the mysterious death of Harlan Thrombey.

Personality: Benoit is a no-nonsense, logical thinker who pays close attention to details. He is highly observant and analytical, and he has an uncanny ability to see through lies and uncover the truth. He is also a highly moral and ethical person who always puts the truth first.

Role: Benoit is the protagonist of the mystery plot. He is tasked with uncovering the truth behind Harlan Thrombey's death, and he will have to rely on his detective skills and intuition to do so. 

Motivation: Benoit is driven by his sense of justice and his desire to uncover the truth. He is determined
===
create a character based on the following information:
plot: ${plot}
genre: ${genre}
role: ${role}
~~~`;
}
