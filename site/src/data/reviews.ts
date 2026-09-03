/**
 * Verified Google reviews — the single source for every review on the site.
 *
 * Hard rule: nothing in this file may be invented. Every entry is a verbatim
 * review copied from the Google Business Profile linked in
 * `src/lib/google-listings.ts`, with the reviewer's real display name and the
 * real recency label Google shows. Surnames are reduced to an initial for
 * privacy; the person is never swapped, and text is never reworded, merged or
 * "tightened". Shorten only at a sentence boundary, marked with [...].
 *
 * WHY ONE LIST. The city arrays here used to be empty with a TODO, while twelve
 * real reviews lived in Reviews.tsx and rendered on /reviews/. The result was a
 * homepage proof section with a headline, five stars and no reviews — on the
 * page that has to earn the booking. Both consumers now read this list, so a
 * review added here appears everywhere it should and nowhere it should not.
 */

export interface CityReview {
  /** Reviewer name exactly as Google displays it. */
  name: string;
  /** Avatar letter — derived from the name. */
  initial: string;
  /** City the reviewer's clean was in. */
  location: string;
  /** Stars as left on Google. */
  rating: number;
  /** Recency label as shown on Google, e.g. "June 2026". */
  date: string;
  /** The review text, verbatim. */
  text: string;
}

export const REVIEWS: CityReview[] = [
  {
    name: "Meredith Shewchuk",
    initial: "M",
    location: "Edmonton",
    rating: 5,
    date: "June 2026",
    text: "We've been getting our house cleaned every 4 weeks and it has been great! Communication is wonderful, our cleaner always shows up on time, is super talented and professional and does an amazing job cleaning!",
  },
  {
    name: "Patrick",
    initial: "P",
    location: "Edmonton",
    rating: 5,
    date: "April 2026",
    text: "Been using Duty Cleaners here in Edmonton once a month for nearly a year now. Very good service and I appreciate they can come at the same time/day each time which suits my schedule",
  },
  {
    name: "Fadase A.",
    initial: "F",
    location: "Calgary",
    rating: 5,
    date: "January 2026",
    text: "Thank you for cleaning my house today. It feels so clean. The two ladies did a wonderful job and listened to me.",
  },
  {
    name: "Christian J.",
    initial: "C",
    location: "Calgary",
    rating: 5,
    date: "September 2025",
    text: "I had one of their cleaners come in today and did an awesome job. Efficient, attention to detail and very friendly. She was awesome. And everything was done right the first time just the way you want it.",
  },
  {
    name: "Linny 84",
    initial: "L",
    location: "Edmonton",
    rating: 5,
    date: "February 2025",
    text: "I did not have the time to do a thorough clean before moving out of my apartment, so I hired Duty Cleaners. I only paid extra for one blind that was pretty dirty. A lot of baseboards and the baseboard heating to clean in my apartment. They did a great job cleaning it all even my fridge and oven, and in the cabinets. It was so clean that my apartment overlooked the small amounts of wear and tear and I got my full deposit back!",
  },
  {
    name: "Rosaleen B.",
    initial: "R",
    location: "Edmonton",
    rating: 5,
    date: "January 2025",
    text: "Very happy!! Booked - Residential post construction cleaning done in Edmonton. This was my first time booking this type of service for our home following a bigger reno project (new floors, baseboards/trim, walls painted). We were very impressed with the cleaning. Two very experienced ladies came and did our 2100 square foot space in about 5.5 hours. […]",
  },
  {
    name: "Bob B.",
    initial: "B",
    location: "Calgary",
    rating: 5,
    date: "January 2025",
    text: "Vicky is awesome, she is friendly, courteous and very excellent at her job!",
  },
  {
    name: "Mom S.",
    initial: "M",
    location: "Edmonton",
    rating: 5,
    date: "December 2024",
    text: "Update: i called Duty cleaners again..the Cleaners were very efficient, perfectly cleaned within exact time.. 5★ for whole team including The manager, Sherree was helpful & provided the service on the same day.. i will definitely go for Duty Cleaners next time 🙂 1st time, Reyce worked at my place, she did an amazing job.. her behavior is very nice and positive .. i truly appreciate her efficient work .. this 5☆ for Reyce !! […]",
  },
  {
    name: "Fidausi S.",
    initial: "F",
    location: "Calgary",
    rating: 5,
    date: "December 2024",
    text: "Duty Cleaners did an amazing job with our move-out cleaning. They managed to make everything look spotless, and we even got a compliment from the landlord on how clean the place was. Super happy with their work.",
  },
  {
    name: "BG B.",
    initial: "B",
    location: "Edmonton",
    rating: 5,
    date: "November 2024",
    text: "A great experience. Spotless house! Well beyond my expectations.",
  },
  {
    name: "Janette T.",
    initial: "J",
    location: "Edmonton",
    rating: 5,
    date: "October 2024",
    text: "I have used Duty Cleaners for all of my move-in cleans and am always impressed by their thorough work and excellent communication.",
  },
  {
    name: "Terry H.",
    initial: "T",
    location: "Edmonton",
    rating: 5,
    date: "August 2024",
    text: "The most professional cleaning service I have ever hired in Edmonton. From the message notices of when they are heading to our home to the phone call the next day to make sure we were happy with their work. Duty Cleaners did a miraculous move out cleaning in our condo. The property was put on the market the very next day looking spotless. Thank you again Duty Cleaners, we will definitely use your professional services again.",
  },
];

/** Newest first is the order they are written in, and the order they render. */
export const EDMONTON_REVIEWS: CityReview[] = REVIEWS.filter(
  (review) => review.location === "Edmonton",
);

export const CALGARY_REVIEWS: CityReview[] = REVIEWS.filter(
  (review) => review.location === "Calgary",
);

export const reviewsForCity = (city: string): CityReview[] =>
  city.toLowerCase().startsWith("calgary") ? CALGARY_REVIEWS : EDMONTON_REVIEWS;
