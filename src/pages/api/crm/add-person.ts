import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { admin } from '@/lib/firebaseAdmin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://uplevel-hq-llc.outseta.com/api/v1/crm/people';
  if (req.method === 'POST') {
    const personData = req.body.personData;
    const uid = req.body.uid;

    try {
      const response = await axios.post(url, personData, {
        headers: {
          Authorization: process.env.OUTSETA_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      await admin.firestore().doc(`users/${uid}`).update({
        outsetaUid: response.data.Uid,
      });

      const listUrl =
        'https://uplevel-hq-llc.outseta.com/api/v1/email/lists/E9LZbZmw/subscriptions';

      await axios.post(
        listUrl,
        {
          EmailList: { Uid: 'E9LZbZmw' },
          Person: {
            Uid: response.data.Uid,
            Email: personData.Email,
            FirstName: personData.FirstName,
            LastName: personData.LastName,
          },
        },
        {
          headers: {
            Authorization: process.env.OUTSETA_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      return res.status(400).send(`Unexpected error: ${error}`);
    }
  }
};

export default handler;
