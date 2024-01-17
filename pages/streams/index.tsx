import type { NextPage } from 'next';
import Link from 'next/link';
import FloatingButton from '@components/floating-button';
import Layout from '@components/layout';
import { Stream } from '@prisma/client';
import useSWR from 'swr';
import Pagination from '@components/pagination';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface StreamsResource {
  ok: boolean;
  streamsCount: {
    _all: number;
  };
  streams: Stream[];
}

const Streams: NextPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useSWR<StreamsResource>(`/api/streams?page=${currentPage}`);

  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(+router.query.page)
    }
  }, [router])

  return (
    <Layout hasTabBar title="라이브">
      {data?.streamsCount._all ? (
        <Pagination take={10} dataSize={data?.streamsCount._all} />
      ) : null}
      <div className=" divide-y-[1px] space-y-4">
        {data?.streams.map((stream) => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <a className="pt-4 block  px-4">
              <div className="w-full relative overflow-hidden rounded-md shadow-sm bg-slate-300 aspect-video">
                <Image
                  layout="fill"
                  src={`https://videodelivery.net/${stream.cloudflareId}/thumbnails/thumbnail.jpg?height=320`}
                />
              </div>
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </a>
          </Link>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
