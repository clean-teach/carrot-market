import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { withApiSession } from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method === 'POST') {
    const {
      session: { user },
      body: { name, price, description },
    } = req;
    const {
      result: {
        uid,
        rtmps: { streamKey, url },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
        },
      )
    ).json();
    const stream = await client.stream.create({
      data: {
        cloudflareId: uid,
        cloudflareUrl: url,
        cloudflareKey: streamKey,
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  } else if (req.method === 'GET') {
    const {
      query: { page },
    } = req;
    const take = 10;
    const skip = take * +page;
    const streamsCount = await client.stream.count({
      select: {
        _all: true,
      },
    });
    const streams = await client.stream.findMany({
      take,
      skip,
    });
    res.json({
      ok: true,
      streamsCount,
      streams,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  }),
);
