import Link from "next/link";
import Image from "next/image";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { publishedPosts, formatPostDate, readingMinutes } from "@/content/blog";
import { site } from "@/content/site";
export const metadata = {
  title: "Blog",
  description: "Things I am learning, working through and thinking about.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Blog | Sajeevan Veeriah",
    description: "Things I am learning, working through and thinking about.",
    url: "/blog/", type: "website", images: [{ url: site.logo }],
  },
};
export default function Blog() {
  return <>
    <Masthead current="blog" />
    <main id="main" className="shell blog-index">
      <header className="page-intro">
        <h1>Blog</h1>
        <p>Practical notes on robotics, embedded systems, AI and building software people can trust.</p>
      </header>
      <div className="blog-list">
        {publishedPosts().map((post) => <article key={post.slug}>
          <div className="blog-list-meta">
            <time className="quiet" dateTime={post.date}>{formatPostDate(post.date)}</time>
            <p className="blog-category">{post.category ?? "Everyday AI"} · {readingMinutes(post)} min read</p>
            {post.image && <Image className="blog-thumbnail" src={post.image.src} alt="" width={post.image.width} height={post.image.height} />}
          </div>
          <div>
            <h2><Link prefetch={false} href={`/blog/${post.slug}/`}>{post.title}</Link></h2>
            <p>{post.description}</p>
            <Link prefetch={false} className="text-link" href={`/blog/${post.slug}/`}>Read article<span className="sr-only">: {post.title}</span></Link>
          </div>
        </article>)}
      </div>
    </main>
    <SiteFooter />
  </>;
}
