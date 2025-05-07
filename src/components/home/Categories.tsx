
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Phone Cases",
    description: "Protect and personalize your device",
    image: "https://images.unsplash.com/photo-1607581072646-80a005fd7614?w=500&auto=format&fit=crop&q=60",
    slug: "phone-cases",
  },
  {
    id: 2,
    name: "T-Shirts",
    description: "Comfortable custom apparel",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60",
    slug: "t-shirts",
  },
  {
    id: 3,
    name: "Hoodies",
    description: "Stay warm with style",
    image: "https://images.unsplash.com/photo-1607038233846-064b5142c885?w=500&auto=format&fit=crop&q=60",
    slug: "hoodies",
  },
  {
    id: 4,
    name: "Mugs",
    description: "For your morning coffee or tea",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60",
    slug: "mugs",
  },
];

const Categories = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (slug: string) => {
    navigate(`/shop?category=${slug}`);
  };

  return (
    <section className="bg-zyra-soft-gray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Shop By Category</h2>
          <p className="mt-2 text-gray-600">
            Find the perfect blank canvas for your creativity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-zyra-purple font-medium text-sm">
                  <span>Shop now</span>
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
