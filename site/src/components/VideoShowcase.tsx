import { useRef, useState } from "react";
import { Play } from "lucide-react";

const SITE_URL = "https://dutycleaners.ca";
const VIDEO_SRC = "/videos/duty-cleaners.mp4";

interface VideoShowcaseProps {
  city: "Edmonton" | "Calgary";
  poster: string;
  posterAlt: string;
}

/**
 * Premium framed "Meet Duty Cleaners" video player with a gold play affordance,
 * caption bar, and VideoObject structured data.
 */
export default function VideoShowcase({ city, poster, posterAlt }: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    setStarted(true);
    videoRef.current?.play();
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Meet Duty Cleaners — hear from the team and local homeowners",
    description: `Meet the Duty Cleaners team and hear what homeowners say about their house cleaning experience with Duty Cleaners in ${city}, Alberta.`,
    thumbnailUrl: `${SITE_URL}${poster}`,
    uploadDate: "2026-08-08",
    duration: "PT1M18S",
    contentUrl: `${SITE_URL}${VIDEO_SRC}`,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
      <div className="text-center mb-6">
        <span className="text-accent font-semibold text-sm uppercase tracking-wide">See Us In Action</span>
        <h3 className="text-2xl md:text-3xl font-bold mt-2">Meet Duty Cleaners</h3>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Meet the team and hear what {city} homeowners say about their Duty Cleaners experience.
        </p>
      </div>

      <div className="rounded-2xl bg-brand-navy p-2 shadow-2xl shadow-brand-navy/30">
        <div className="relative overflow-hidden rounded-xl">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            controls={started}
            playsInline
            preload="none"
            poster={poster}
            className="w-full h-auto aspect-video object-cover"
          >
            Your browser does not support the video tag.
          </video>
          {!started && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play the Meet Duty Cleaners video"
              className="group absolute inset-0 flex items-center justify-center bg-brand-navy/40 transition-colors duration-300 hover:bg-brand-navy/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
            >
              <img src={poster} alt={posterAlt} className="sr-only" />
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold text-brand-gold-foreground shadow-xl shadow-brand-navy/50 transition-transform duration-300 group-hover:scale-110">
                <Play className="h-9 w-9 fill-current" aria-hidden="true" />
              </span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-navy/80 px-4 py-1.5 text-xs font-semibold text-brand-navy-foreground backdrop-blur-sm">
                Watch — 1:18
              </span>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm font-semibold text-brand-navy-foreground">Meet Duty Cleaners — the team &amp; the homeowners we serve</p>
          <span className="shrink-0 rounded-full bg-brand-gold/15 px-3 py-1 text-sm font-bold text-brand-navy-foreground">1:18</span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <strong className="text-foreground">Inside the video:</strong> an introduction from our team · homeowners sharing their cleaning experience · the care we bring to every visit
      </p>
    </div>
  );
}
