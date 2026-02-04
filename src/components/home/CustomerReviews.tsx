import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Rajesh Patel",
    designation: "Director, Patel Industries",
    location: "Ahmedabad",
    rating: 5,
    review:
      "Excellent quality executive chairs! We ordered 50 chairs for our new office and the durability is outstanding. Highly recommend Dipak Steel Furniture.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    designation: "Principal, Sunrise Public School",
    location: "Gandhinagar",
    rating: 5,
    review:
      "We furnished our entire school with their classroom benches and chairs. The build quality is perfect for heavy daily use. Great value for money!",
  },
  {
    id: 3,
    name: "Dr. Amit Desai",
    designation: "Chief Medical Officer, City Hospital",
    location: "Ahmedabad",
    rating: 5,
    review:
      "The institutional seating and steel beds we purchased are exactly what we needed. Durable, easy to clean, and very comfortable for patients.",
  },
  {
    id: 4,
    name: "Meera Joshi",
    designation: "Interior Designer",
    location: "Surat",
    rating: 5,
    review:
      "I've been recommending Dipak Steel Furniture to all my clients. Their sofa sets and almirahs are stylish and built to last. Excellent craftsmanship!",
  },
  {
    id: 5,
    name: "Vikram Singh",
    designation: "HR Manager, TechStart Solutions",
    location: "Vadodara",
    rating: 5,
    review:
      "Our startup ordered task chairs and workstations for 100+ employees. The ergonomic design has really improved employee comfort and productivity.",
  },
  {
    id: 6,
    name: "Anita Mehta",
    designation: "Owner, Mehta Restaurant Chain",
    location: "Rajkot",
    rating: 5,
    review:
      "The dining sets and cafe chairs are perfect for our restaurants. Easy maintenance and they look great even after years of heavy use.",
  },
];

const CustomerReviews = () => {
  return (
    <section className="bg-secondary/50 py-14 md:py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">
            Testimonials
          </p>
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Trusted by offices, schools, hospitals, and homes across Gujarat and
            India for quality furniture solutions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Quote Icon */}
              <Quote className="absolute right-4 top-4 h-8 w-8 text-accent/20" />

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="mb-6 text-muted-foreground">"{review.review}"</p>

              {/* Reviewer Info */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">
                  {review.designation}
                </p>
                <p className="text-xs text-accent">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
