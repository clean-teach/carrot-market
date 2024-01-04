import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { withApiSession } from '@libs/server/withSession';
import { Kind } from '@prisma/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    session: { user },
    query: { kind },
  } = req;
  if (kind) {
    const records = await client.record.findMany({
      where: {
        userId: user?.id,
        kind: kind as Kind,
      },
      include: {
        product: {
          select: {
            records: {
              where: {
                kind: kind as Kind,
              },
            },
          },
          // include: {
          //   _count: {
          //     select: {
          //       records: true,
          //     },
          //   },
          // },
        },
      },
    });
    res.json({
      ok: true,
      records,
    });
  } else {
    res.json({
      ok: false,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
