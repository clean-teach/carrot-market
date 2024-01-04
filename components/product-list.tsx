import useSWR from "swr";
import Item from "./item";
import { Product, Record } from "@prisma/client";

interface ProductWithCount {
    kind: "favs" | "sales" | "purchases";
}

interface RecordWithProducts extends Record {
    ok: boolean;
    product: Product;
}

interface ProductListResponse {
    [key: string]: RecordWithProducts[];
}

export default function ProductList({ kind }: ProductWithCount) {
    const { data } = useSWR<ProductListResponse>(`/api/users/me/records?kind=${kind}`);
    console.log(data?.records);
    return <>
        {
            data && data.ok && data.records ? data?.records.map((record) => (
                <Item
                    id={record.id}
                    key={record.id}
                    title={record.product?.name}
                    price={record.product?.price}
                    hearts={1}
                />
            )) : null
        }
    </>
}