import Link from 'next/link';

// Placeholder data for automotive categories
const categories = [
  { slug: 'engine-parts', name: 'Engine Components', description: 'Cylinder heads, pistons, gaskets, and more.' },
  { slug: 'suspension', name: 'Suspension & Steering', description: 'Shocks, struts, control arms, and tie rods.' },
  { slug: 'brakes', name: 'Brake Systems', description: 'Pads, rotors, calipers, and fluid lines.' },
  { slug: 'lighting', name: 'Vehicle Lighting', description: 'Headlights, taillights, and interior bulbs.' },
  { slug: 'exteriors', name: 'Exterior Body Parts', description: 'Fenders, bumpers, hoods, and mirrors.' },
  { slug: 'electrical', name: 'Electrical Systems', description: 'Batteries, alternators, starters, and wiring.' },
  // Vehicle type categories
  { slug: 'trucks', name: 'Truck Accessories', description: 'Lift kits, bed liners, and heavy-duty parts.' },
  { slug: 'sports-cars', name: 'Performance Tuning', description: 'Intakes, exhausts, and performance chips.' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Explore Automotive Categories
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Find the perfect part or accessory for your vehicle.
          </p>
        </header>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`} legacyBehavior>
              <a className="block h-full transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl rounded-xl">
                <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-xl flex flex-col h-full">
                  
                  {/* Category Title */}
                  <h2 className="text-xl font-semibold text-indigo-600 truncate mb-2">
                    {category.name}
                  </h2>
                  
                  {/* Category Description */}
                  <p className="text-gray-500 flex-grow mb-4">
                    {category.description}
                  </p>

                  {/* Link Button */}
                  <span className="inline-flex items-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg justify-center mt-auto">
                    View Products &rarr;
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
