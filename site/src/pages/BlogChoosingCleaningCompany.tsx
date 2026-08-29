import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { modifiedFor } from "@/data/post-dates";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Phone, CheckCircle2, Users, Shield, Star, Settings, MessageSquare, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/choosing-cleaning-company-hero.webp";
import credentialsImage from "@/assets/blog/cleaning-credentials.webp";
import reviewsImage from "@/assets/blog/reading-reviews.webp";

const keyFactors = [
  {
    icon: Users,
    title: "Assessing Your Cleaning Needs",
    description: "Understanding your specific cleaning needs is the first step in finding the right cleaning company. Are you looking for regular maintenance cleaning, a one-time deep clean, or specialized services like carpet or upholstery cleaning? Consider the size and type of space that needs cleaning—residential, commercial, or industrial—as different companies may specialize in different areas.",
    details: "Identify any unique requirements you have, such as specific cleaning products or pet-friendly services. By clearly defining your cleaning needs, you can narrow down your search to companies that offer the exact services you're looking for, ensuring a better match and a more satisfactory outcome."
  },
  {
    icon: Star,
    title: "Evaluating Experience and Expertise",
    description: "When choosing a cleaning company, it's crucial to evaluate their experience and expertise. Companies with several years of experience are likely to have refined their processes and built a reliable team. Look for businesses that have a proven track record in the type of cleaning you need.",
    details: "Experienced cleaners are better equipped to handle unexpected challenges and provide efficient, high-quality service. Ask about the training and qualifications of their staff to ensure they are knowledgeable and skilled. An experienced company can offer insights and recommendations based on past projects, ensuring your cleaning needs are met with professionalism and attention to detail."
  },
  {
    icon: Shield,
    title: "Checking Credentials and Certifications",
    description: "A reputable cleaning company should have the necessary credentials and certifications to operate legally and safely. Licensing indicates that the company meets local regulatory requirements, and a clear screening process for cleaners tells you who is actually entering your home.",
    details: "Additionally, look for certifications from industry organizations that demonstrate adherence to best practices and standards. These credentials provide peace of mind that you are hiring a professional and trustworthy service provider, ensuring both the quality of work and the safety of your property."
  }
];

const customizationOptions = [
  {
    title: "Tailored Cleaning Plans",
    description: "Look for companies that offer personalized cleaning plans. This allows you to specify which areas need more attention and which tasks are a priority."
  },
  {
    title: "Flexible Scheduling",
    description: "A good cleaning company should be able to accommodate your schedule. Whether you need cleaning services during off-hours, weekends, or on a specific day of the week, flexibility is key."
  },
  {
    title: "Special Requests",
    description: "If you have particular preferences, such as using particular products or focusing on high-traffic areas, the company should be willing to accommodate these requests."
  },
  {
    title: "Adjustable Frequency",
    description: "Depending on your needs, you may require daily, weekly, bi-weekly, or monthly cleaning services. A customizable plan can adjust the frequency to match your requirements."
  },
  {
    title: "Service Upgrades",
    description: "Sometimes, you might need additional services like deep cleaning or carpet cleaning. A company that allows you to add or remove services as needed provides a more tailored experience."
  }
];

const customerSupportPoints = [
  {
    title: "Responsive Communication",
    description: "Look for companies that respond promptly to inquiries. Quick replies to emails or phone calls indicate a high level of professionalism and customer care."
  },
  {
    title: "Clear Information",
    description: "The company should provide clear and detailed information about their services, pricing, and policies. This transparency helps you make informed decisions."
  },
  {
    title: "Problem Resolution",
    description: "Assess how the company handles complaints or issues. A good cleaning company will have a systematic approach to resolving problems and ensuring customer satisfaction."
  },
  {
    title: "Friendly Staff",
    description: "Interactions with customer service representatives should be pleasant and helpful. Courteous and knowledgeable staff enhance your overall experience."
  },
  {
    title: "Follow-Up",
    description: "Companies that follow up after a service to ensure everything was completed to your satisfaction demonstrate a commitment to quality and customer care."
  }
];

export default function BlogChoosingCleaningCompany() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>How to Choose a Cleaning Company | Duty Cleaners</title>
        <meta
          name="description"
          content="How to choose the right cleaning company for your home or office - from assessing your needs to checking credentials, the key factors that matter."
        />
        <link rel="canonical" href="https://dutycleaners.ca/blog/choosing-cleaning-company/" />
        <meta property="og:title" content="How to Choose a Cleaning Company | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Choose a Cleaning Company | Duty Cleaners" />
        <meta name="twitter:description" content="How to choose the perfect cleaning company — assessing your needs, checking credentials, comparing services." />
        <meta property="og:description" content="How to choose the perfect cleaning company — assessing your needs, checking credentials, comparing services." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/blog/choosing-cleaning-company/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Choosing the Right Cleaning Company for Your Needs",
          description: "How to choose the perfect cleaning company — assessing your needs, checking credentials, and comparing services.",
          // Dates match the date shown on the page and in the blog index; the
          // previous values (2024-06-01 / 2026-07-02) contradicted both. The
          // old image URL pointed at /blog/... which is not a served path.
          image: absoluteAssetUrl(heroImage),
          datePublished: "2026-01-27",
          dateModified: modifiedFor("/blog/choosing-cleaning-company", "2026-01-27"),
          author: ARTICLE_AUTHOR,
          publisher: ARTICLE_PUBLISHER,
          mainEntityOfPage: canonicalUrlForPath("/blog/choosing-cleaning-company")
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-[21/9] max-h-[500px] overflow-hidden">
            <img width={1920} height={1080}
              src={heroImage}
              alt="Professional cleaning team greeting homeowner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
          <div className="container mx-auto px-4 -mt-32 relative z-10">
            <div className="max-w-4xl">
              <Link to="/blog/" className="inline-flex items-center text-primary hover:underline mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                Hiring Guide
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Choosing the Right Cleaning Company for Your Needs
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground mb-8">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  January 27, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  14 min read
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Most people booking a cleaner for the first time are comparing three quotes and a handful of reviews, with no easy way to tell which company will actually turn up and do the work. With so many options, how do you know which one will meet your specific needs? At Duty Cleaners, we understand the importance of a clean and organized space, whether it's your home or office.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  In this blog, we'll guide you through the key factors to consider when choosing a cleaning company. From understanding your requirements to checking credentials and reviews, we'll help you make an informed decision. Let's dive into what makes a cleaning service truly exceptional and how you can find the right match for your needs.
                </p>
              </div>

              {/* Key Factors Section */}
              <h2 className="text-3xl font-bold mb-8 text-foreground">Key Factors to Consider</h2>
              <div className="space-y-8 mb-16">
                {keyFactors.map((factor, index) => {
                  const Icon = factor.icon;
                  return (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{factor.title}</h3>
                            <p className="text-muted-foreground mb-3">{factor.description}</p>
                            <p className="text-muted-foreground">{factor.details}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Credentials Image */}
              <div className="my-12">
                <img width={1024} height={1024}
                  src={credentialsImage}
                  alt="Professional cleaning company credentials and certifications"
                  className="w-full rounded-xl shadow-lg"
                />
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Look for proper licensing, screening practices, and certifications when evaluating cleaning companies
                </p>
              </div>

              {/* Customization Options */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Exploring Customization Options
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                When choosing a cleaning company, it's important to find one that offers customization options to meet your unique needs. A one-size-fits-all approach often doesn't work for everyone, so here's why exploring customization options is essential:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {customizationOptions.map((option, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{option.title}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-muted-foreground mb-12">
                By prioritizing customization, you ensure that the cleaning service aligns perfectly with your specific needs and lifestyle. This personalized approach leads to higher satisfaction and a cleaner, more comfortable environment.
              </p>

              {/* Customer Support Section */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                Assessing Customer Support and Communication
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Effective customer support and communication are crucial factors in choosing a cleaning company. Here's how to evaluate this aspect to ensure a smooth and satisfactory experience:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {customerSupportPoints.map((point, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{point.title}</h4>
                          <p className="text-sm text-muted-foreground">{point.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-muted-foreground mb-12">
                By focusing on these aspects, you can gauge the level of support and communication a cleaning company offers. Excellent customer service enhances the overall experience and ensures that any issues are promptly addressed, leading to a more satisfying and reliable service.
              </p>

              {/* Reviews Image */}
              <div className="my-12">
                <img width={1024} height={1024}
                  src={reviewsImage}
                  alt="Customer reading positive reviews online"
                  className="w-full rounded-xl shadow-lg"
                />
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Reading reviews helps you understand real customer experiences before making a decision
                </p>
              </div>

              {/* Reading Reviews Section */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                Reading Reviews and Testimonials
              </h2>
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-muted-foreground">
                  Customer reviews and testimonials are valuable resources when choosing a cleaning company. They provide insights into the experiences of past clients and can highlight the company's strengths and weaknesses. Check reviews on multiple platforms, such as Google, Yelp, and social media, to get a comprehensive view.
                </p>
                <p className="text-muted-foreground mt-4">
                  Look for patterns in the feedback—consistent praise for reliability and thoroughness or recurring complaints about punctuality or communication. Reviews can also reveal how the company handles issues and customer service. Positive testimonials and high ratings are strong indicators of a reliable and <Link to="/" className="text-primary hover:underline font-medium">professional cleaning service</Link>, helping you make an informed decision. Choosing in Calgary specifically? Our <Link to="/blog/cleaning-services-calgary/" className="text-primary hover:underline font-medium">Calgary hiring guide</Link> covers what to check before you book there.
                </p>
              </div>

              {/* Comparing Services Section */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                Comparing Services, Packages, and Pricing
              </h2>
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-muted-foreground">
                  Cleaning companies offer a range of services and packages tailored to different needs. Compare what each company provides to ensure they can fulfill your requirements. Some companies offer comprehensive packages that cover everything from basic cleaning to deep cleaning, while others may specialize in specific tasks like window cleaning or carpet care.
                </p>
                <p className="text-muted-foreground mt-4">
                  Check if the company provides flexible and customizable packages that allow you to select only the services you need. This customization can help you avoid paying for unnecessary services and ensure the cleaning plan aligns with your preferences and budget, offering a more tailored and efficient solution.
                </p>
                <p className="text-muted-foreground mt-4">
                  Pricing is a crucial factor when selecting a cleaning company, but it's important to focus on value rather than just cost. Look for a company that offers transparent pricing with no hidden fees. Request detailed quotes that outline what is included in the service. Compare these quotes to understand the market rate and what you are getting for your money.
                </p>
                <p className="text-muted-foreground mt-4">
                  Be cautious of significantly lower prices, as they may indicate lower quality or incomplete services. Aim for a balance where you receive high-quality service at a fair price. Consider the overall value, including the company's reputation, reliability, and the quality of their work, to ensure you are making a wise investment.
                </p>
              </div>

              {/* Conclusion */}
              <Card className="bg-primary/5 border-primary/20 mb-12">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">What to do with this</h2>
                  <p className="text-muted-foreground mb-4">
                    Choosing the right cleaning company can make a significant difference in maintaining a pristine and comfortable space. By assessing your cleaning needs, evaluating experience, checking credentials, and exploring customization options, you ensure that the service you select aligns perfectly with your requirements. Don't overlook the importance of customer support and communication, as they are crucial for a smooth and satisfactory experience.
                  </p>
                  <p className="text-muted-foreground">
                    If you want to see how we answer these questions ourselves: our prices are published by home size, our terms set out the cancellation, lockout and damage policies in plain language, and every cleaner is reference-checked before their first job and rated by the customer after every visit.
                  </p>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to Experience Professional Cleaning?
                  </h2>
                  <p className="text-lg opacity-90 mb-6">
                    Let Duty Cleaners help you find the ideal cleaning solution for your space and ensure a spotless result every time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" variant="secondary" asChild className="text-primary">
                      <a href="tel:7809136565" className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Edmonton: 780-913-6565
                      </a>
                    </Button>
                    <Button size="lg" variant="secondary" asChild className="text-primary">
                      <a href="tel:4037681341" className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Calgary: (403) 768-1341
                      </a>
                    </Button>
                  </div>
                  <div className="mt-6">
                    <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                      <Link to="/#quote">See My Instant Price</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
