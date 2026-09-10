import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { publishedPosts, formatPostDate } from "@/content/blog";
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
        <p>Things I am learning, working through and thinking about.</p>
      </header>
      <div className="blog-list">
        {publishedPosts().map((post) => <article key={post.slug}>
          <time className="quiet" dateTime={post.date}>{formatPostDate(post.date)}</time>
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
