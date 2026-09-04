import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug?: string;
  index: number;
}

/**
 * The whole card used to be one <Link>, which caused two separate faults.
 *
 * The anchor text was everything inside it — category, reading time, title,
 * excerpt, date, reading time again and "Read Article" — so the eight links out
 * of /blog/ ran from 239 to 290 characters each. An anchor is the clearest
 * statement a page makes about what sits at the other end, and none of these
 * made one; they arrived at eight different articles under eight near-identical
 * walls of text.
 *
 * The second fault was structural: a <Button> inside that <Link> put a <button>
 * element inside an <a>. Interactive content cannot nest, and eight of them
 * shipped on the built page. Browsers recover from it in their own ways and
 * assistive technology does not have to.
 *
 * So the card is a plain div, the title is the anchor, and an ::after stretches
 * that one anchor across the card — the whole card stays clickable, the design
 * does not move, and there is exactly one control per card. "Read Article" is
 * now the span it always looked like, hidden from the accessibility tree so it
 * is not announced as a second, unreachable control.
 */
export default function BlogPostCard({ title, excerpt, category, date, readTime, image, slug, index }: BlogPostCardProps) {
  return (
    <div
      className="opacity-0 animate-fade-slide-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      <div className="block h-full">
        <Card className="relative overflow-hidden h-full group cursor-pointer bg-white/95 border-primary/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]" style={{ transformStyle: "preserve-3d" }}>
          <div className="aspect-[16/10] overflow-hidden relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full shadow-sm">
                <Sparkles className="h-3 w-3 group-hover:rotate-12 transition-transform duration-300" />
                {category}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-navy/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-sm">
                <Clock className="h-3 w-3" />
                {readTime}
              </span>
            </div>
          </div>
          <CardContent className="p-6 flex flex-col flex-1">
            <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {slug ? (
                <Link
                  to={slug}
                  className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {title}
                </Link>
              ) : (
                title
              )}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
              {excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-3 border-t border-primary/10">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary/60" />
                {date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary/60" />
                {readTime}
              </span>
            </div>
            <span
              aria-hidden="true"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-sm",
              )}
            >
              Read Article
              <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
