
import React from "react";

const testimonials = [
  {
    id: 1,
    content:
      "I ordered a custom phone case with my dog's photo and it came out perfect! The quality is amazing and the colors are vibrant. Highly recommend!",
    author: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    role: "Happy Customer",
    rating: 5,
  },
  {
    id: 2,
    content:
      "The design tool was so easy to use. I created a hoodie with my own artwork and the print quality exceeded my expectations. Will definitely order again.",
    author: "Michael rach",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "Designer",
    rating: 5,
  },
  {
    id: 3,
    content:
      "Bought custom mugs as gifts for my team and they were a big hit! The customization options are incredible and shipping was faster than expected.",
    author: "Jessica trils",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    role: "Office Manager",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-zyra-soft-gray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-gray-600">
            Don't just take our word for it - see what others think about their
            custom products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full mr-4"
                  src={testimonial.avatar}
                  alt={testimonial.author}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
