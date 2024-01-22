import type { NextRequest, NextFetchEvent } from 'next/server';
('next/server');

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log(req.ua);
}
