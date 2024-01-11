import { cls } from '@libs/client/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Props {
    take: number;
    dataSize: number;
}

export default function Pagination({ take, dataSize }: Props) {
    const router = useRouter();
    const totalPages = Math.floor(dataSize / take);
    const [currentPage, setCurrentPage] = useState<number>();
    const [showPages, setShowPages] = useState<(number | null)[]>();

    const onPageClick = (page: number | null) => {
        router.push(`${router.pathname}?page=${page}`)
    }
    const onFirstClick = () => {
        router.push(`${router.pathname}?page=${1}`)
    }
    const onLastClick = () => {
        router.push(`${router.pathname}?page=${totalPages}`)
    }

    const setPageNumber = (currentPage: number) => {
        if (currentPage) {
            const first = currentPage - 2;
            const second = currentPage - 1;
            const third = currentPage;
            const fourth = currentPage + 1;
            const fifth = currentPage + 2;
            const newShowPages = [
                first <= 0 ? null : first,
                second <= 0 ? null : second,
                third,
                fourth >= totalPages ? null : fourth,
                fifth >= totalPages ? null : fifth
            ];
            setShowPages(newShowPages)
        }
    }

    useEffect(() => {
        if (router.query.page) {
            setCurrentPage(+router.query.page);
        }
    }, [router])

    useEffect(() => {
        if (currentPage) {
            setPageNumber(currentPage);
        }
    }, [currentPage])

    return (
        <div>
            <div className=' my-2 mx-auto w-1/2 flex justify-between'>
                <button type="button" onClick={onFirstClick} className=' border rounded-md p-2'>First</button>
                {showPages?.map((page, index) => {
                    return <button type="button" key={index} onClick={() => onPageClick(page)} className={index === 2 ? ' text-red-400 font-bold underline underline-offset-1' : ''}>{page}</button>
                })}
                <button type="button" onClick={onLastClick} className=' border rounded-md p-2'>Last</button>
            </div>
        </div>
    );
}
