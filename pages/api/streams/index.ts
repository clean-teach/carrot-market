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
    const stream = await client.stream.create({
      data: {
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
