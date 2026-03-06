import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getBlogPosts } from "@/lib/api";
import Link from "next/link";

export const revalidate = 43200; // 12 hours

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 fade-in">
        <h1 className="text-5xl md:text-6xl font-heading font-extrabold uppercase tracking-tight text-white mb-12 text-center md:text-left">
          Transmission
        </h1>

        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
                <article className="bg-charcoal rounded-3xl p-8 shadow-2xl border border-border hover:shadow-royal/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-4">
                    <h2 className="text-2xl font-heading font-bold text-white group-hover:text-royal transition-colors">
                      {post.title}
                    </h2>
                    <span className="text-gray-500 font-sans text-sm font-medium shrink-0">
                      {post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                    </span>
                  </div>
                  <p className="text-gray-400 font-sans leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-6 text-royal font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    Read More 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="bg-charcoal rounded-3xl p-12 shadow-sm border border-border text-center">
              <p className="text-xl text-gray-500 font-sans">No transmissions available yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
