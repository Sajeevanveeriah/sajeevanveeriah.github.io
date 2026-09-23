import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { JournalIndex, type JournalEntry } from "@/components/JournalIndex";
import { publishedPosts, formatPostDate, readingMinutes, postTopic, blogTopics } from "@/content/blog";
import { pageMetadata } from "@/content/seo";

export const metadata = {
  ...pageMetadata({
    title: "Journal: robotics, AI and software",
    description: "Practical articles on robotics, embedded systems, AI and dependable software, plus engineering case studies by Sajeevan Veeriah.",
    path: "/blog/",
  }),
  alternates: { canonical: "/blog/", types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default function Blog() {
  const entries: JournalEntry[] = publishedPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    displayDate: formatPostDate(post.date),
    topic: postTopic(post),
    minutes: readingMinutes(post),
    ...(post.image ? { image: { src: post.image.src, alt: post.image.alt, width: post.image.width, height: post.image.height } } : {}),
  }));
  return <>
    <Masthead current="blog" />
    <main id="main" className="container blog-index">
      <header className="page-head">
        <p className="eyebrow">Journal</p>
        <h1>Notes from the bench.</h1>
        <p>Practical writing on robotics, embedded systems, AI and software people can trust, plus detailed case studies of my own projects.</p>
      </header>
      <noscript><style>{".journal-controls{display:none}"}</style></noscript>
      <JournalIndex entries={entries} topics={blogTopics} />
    </main>
    <SiteFooter />
  </>;
}
