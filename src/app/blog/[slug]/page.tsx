import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getBlogPost, getBlogPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export const revalidate = 43200; // 12 hours

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.meta.title} | Whispair Blog`,
    description: post.meta.description,
    keywords: post.meta.keywords,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      authors: [post.meta.author || "Whispair"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
    }
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Generate structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    description: post.meta.description,
    author: [{
      '@type': 'Person',
      name: post.meta.author || 'Whispair',
    }],
    datePublished: post.meta.date,
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />
      
      <main className="flex-1 max-w-[720px] w-full mx-auto px-4 sm:px-6 pt-32 pb-20 fade-in">
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="bg-charcoal rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          
          <header className="mb-10 text-center border-b border-white/5 pb-10">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
              {post.meta.title}
            </h1>
            <div className="text-sm font-sans text-gray-500 font-medium uppercase tracking-widest flex items-center justify-center gap-4">
              {post.meta.date && <time dateTime={new Date(post.meta.date).toISOString()}>{new Date(post.meta.date).toLocaleDateString()}</time>}
              <span>•</span>
              <span>By {post.meta.author || "Whispair"}</span>
            </div>
          </header>

          <div 
            className="prose prose-lg max-w-none text-gray-300 prose-p:font-sans prose-p:text-[18px] prose-p:leading-relaxed prose-headings:font-heading prose-headings:text-white prose-a:text-royal prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-strong:text-white prose-img:rounded-2xl prose-blockquote:text-gray-400 prose-blockquote:border-royal"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </article>
      </main>

      <Footer />
    </div>
  );
}
