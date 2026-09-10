import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { posts, formatPostDate } from "@/content/blog";
import { site } from "@/content/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) return {};
  return {
    title: post.title, description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.title, description: post.description,
      type: "article", url: `/blog/${post.slug}/`,
      publishedTime: post.date, authors: [site.name],
      images: [{ url: site.logo, alt: site.name }],
    },
    twitter: { card: "summary", title: post.title, description: post.description, images: [site.logo] },
  };
}
export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) notFound();
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.description,
    datePublished: post.date, mainEntityOfPage: `${site.url}/blog/${post.slug}/`,
    author: { "@type": "Person", name: site.name, url: site.url },
  };
  return <>
    <Masthead current="blog" />
    <main id="main" className="shell blog-article">
      <Link prefetch={false} className="back-link" href="/blog/">Back to blog</Link>
      <article>
        <header className="blog-header">
          <p className="quiet"><time dateTime={post.date}>{formatPostDate(post.date)}</time> · By Sajeevan (Saj) Veeriah</p>
          <h1>{post.title}</h1>
          <p className="blog-deck">{post.description}</p>
        </header>
        <div className="blog-layout">
          <nav className="blog-contents" aria-label="In this article">
            <h2>In this article</h2>
            <ol>{post.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
          </nav>
          <div className="blog-body">
            {post.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {post.sections.map((section) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2 id={`${section.id}-heading`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.table && <table>
                <caption className="sr-only">{section.title}</caption>
                <thead><tr>{section.table.headings.map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
                <tbody>{section.table.rows.map(([label, detail]) => <tr key={label}><th scope="row">{label}</th><td>{detail}</td></tr>)}</tbody>
              </table>}
              {section.after?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.steps && <ol className="blog-routine">{section.steps.map(([label, detail]) => <li key={label}><strong>{label}</strong><span>{detail}</span></li>)}</ol>}
              {section.sources && <p className="blog-citations">Sources: {section.sources.map((number) => <a key={number} href={`#source-${number}`} aria-label={`Source ${number}: ${post.sources[number - 1].label}`}>[{number}]</a>)}</p>}
            </section>)}
            <section className="blog-sources" aria-labelledby="sources-heading">
              <h2 id="sources-heading">Sources and further reading</h2>
              {post.note && <p>{post.note}</p>}
              <ol>{post.sources.map((source, i) => <li key={source.url} id={`source-${i + 1}`}><a href={source.url}>{source.label}</a></li>)}</ol>
            </section>
            <Link prefetch={false} className="text-link" href="/blog/">Back to all posts</Link>
          </div>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </main>
    <SiteFooter />
  </>;
}
