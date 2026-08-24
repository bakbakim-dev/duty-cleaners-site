import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
      },

      /* Readability floor: nothing renders below 14px (WCAG-friendly for
         older visitors). `text-xs` is remapped rather than hunted down
         across every page. */
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.25rem" }],
      },
       colors: {
         border: "hsl(var(--border))",
         input: "hsl(var(--input))",
         ring: "hsl(var(--ring))",
         background: "hsl(var(--background))",
         foreground: "hsl(var(--foreground))",
         "cream-50": "hsl(var(--cream-50))",
         "blue-grey-100": "hsl(var(--blue-grey-100))",
         "brand-navy": {
           DEFAULT: "hsl(var(--brand-navy))",
           foreground: "hsl(var(--brand-navy-foreground))",
         },
         "brand-gold": {
           DEFAULT: "hsl(var(--brand-gold))",
           foreground: "hsl(var(--brand-gold-foreground))",
         },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "0 0% 100%",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        "destructive-ink": "hsl(var(--destructive-ink))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "accent-on-dark": "hsl(var(--accent-on-dark))",
        "fine-print": "hsl(var(--fine-print))",
        "fine-print-on-dark": "hsl(var(--fine-print-on-dark))",
        "gold-ink": "hsl(var(--gold-ink))",

        savings: {
          DEFAULT: "hsl(var(--savings-surface))",
          foreground: "hsl(var(--savings-ink))",
          border: "hsl(var(--savings-border))",
        },

        "quote-price": {
          DEFAULT: "hsl(var(--quote-price-surface))",
          border: "hsl(var(--quote-price-border))",
        },
        "quote-shelf": {
          DEFAULT: "hsl(var(--quote-shelf-surface))",
          border: "hsl(var(--quote-shelf-border))",
        },
        "quote-detail": {
          DEFAULT: "hsl(var(--quote-detail-surface))",
          border: "hsl(var(--quote-detail-border))",
        },



        "accent-bright": {
          DEFAULT: "hsl(var(--accent-bright))",
          foreground: "hsl(var(--accent-bright-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "gradient-flow": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        "gradient-text": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-15%)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        shimmer: {
          "0%": {
            "background-position": "-200% 0",
          },
          "100%": {
            "background-position": "200% 0",
          },
        },
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        tilt: {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(-1deg)",
          },
          "75%": {
            transform: "rotate(1deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-flow": "gradient-flow 8s ease infinite",
        "gradient-text": "gradient-text 3s ease infinite",
        "bounce-slow": "bounce-slow 2s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "slide-in": "slide-in 0.5s ease-out",
        tilt: "tilt 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
