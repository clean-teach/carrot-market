import Layout from "@components/layout";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const Post: NextPage<{ post: string, data: { title: string, date: string, category: string } }> = ({ post, data }) => {
    return <Layout title={data.title} seoTitle={data.title}>
        <div dangerouslySetInnerHTML={{ __html: post }} className="blog-post-content"></div>
    </Layout>;
};

export function getStaticPaths() {
    const files = readdirSync('./posts').map(file => {
        const [name, extension] = file.split('.');
        return {
            params: { slug: name }
        }
    });
    return {
        paths: files,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
    const { value } = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(content)
    console.log(value, data)
    return {
        props: { post: value, data },
    };
}

export default Post;