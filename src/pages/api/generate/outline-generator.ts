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
      const text = req.body.text;

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
        prompt: generatePlot(text),
        temperature: 0.78,
        max_tokens: 1800,
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

function generatePlot(text: string) {
  return `Plot: After a tornado hurls through Kansas, Dorothy Gale and her dog, Toto, are swept away from their home to the colorful and vibrant Land of Oz. In order to find their way back home, they must embark on a journey to the Emerald City, where the Wizard of Oz resides. On the way, they are accompanied by a Scarecrow who wants a brain, a Tin Man who wants a heart, and a Cowardly Lion who wants courage. They are hopeful that the Wizard will be able to fulfill their wishes, but not far behind them is the Wicked Witch of the West, who is out for revenge on Dorothy after she accidentally killed her sister, the Wicked Witch of the East.
Story structure: Three Act Structure
Story outline:
Act I

Dorothy and her family are hard-working farmers and she has a dog she cares for called Toto. Dorothy feels misunderstood and under-appreciated.

Dorothy runs away from home and encounters a professor who encourages her to go home. Upon her return, a tornado causes Dorothy to be struck in the head by a window. Her home has been whisked off to the Land of Oz when she wakes up.

Frightened and confused, Dorothy wants to go home and is told by Glinda the Good Witch that the only way is to follow the Yellow Brick Road to the Emerald City where The Wizard lives. Dorothy decides to follow the road, and it's established the Wicked Witch will try to stop her.

Act II

Dorothy meets the Scarecrow, the Tin Man, and Lion. They travel down the Yellow Brick Road, where they encounter obstacles such as apple-throwing trees and sleep-inducing poppies.

Dorothy finally reaches the Emerald City and meets with The Wizard, who is a big disappointment. He initially refuses to meet with them, and when he eventually does, he declines to help them until they bring him the Wicked Witch’s broomstick.

Dorothy must decide whether to risk heading to the Wicked Witch's castle or give up on her chance of going home. She and her companions decide to confront the witch.

Act III

While on the way to the Wicked Witch's castle, Dorothy is captured. The Witch finds out that the ruby slippers can't be taken against Dorothy's will while she's alive, so she sets an hourglass and threatens that Dorothy will die when it runs out.

Dorothy throws a bucket of water on the Scarecrow, who has been set alight. She ends up accidentally dousing the Witch, who melts into a puddle. The guards hand the Witch's broom to Dorothy.

The Scarecrow receives a diploma, the Tin Man receives a “heart,” and the Lion receives a medal of valor. The Good Witch explains that Dorothy has always had the power to go home; she just didn't tell her earlier because she wouldn't have believed it. Dorothy taps her ruby slippers and heads back to Kansas to greet her family lovingly.
===
Plot:${text}
Story structure: Three Act Structure
Story outline:`;
}
