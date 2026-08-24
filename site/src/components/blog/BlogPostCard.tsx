import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function BlogPostCard({ title, excerpt, category, date, readTime, image, slug, index }: BlogPostCardProps) {
  const Wrapper = slug ? Link : "div";
  const wrapperProps = slug ? { to: slug } : {};

  return (
    <div
      className="opacity-0 animate-fade-slide-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      <Wrapper {...(wrapperProps as any)} className="block h-full">
        <Card className="overflow-hidden h-full group cursor-pointer bg-white/95 border-primary/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]" style={{ transformStyle: "preserve-3d" }}>
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
              {title}
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
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-sm">
              Read Article
              <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </CardContent>
        </Card>
      </Wrapper>
    </div>
  );
}
