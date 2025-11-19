'use client';

import { useState, useEffect } from 'react';
// import { mockVehicleMakes } from '@/lib/mockVehicleData'; // Removed mock data import

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [makes, setMakes] = useState<string[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [makesError, setMakesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingMakes(true);
        setMakesError(null);
        const response = await fetch('/api/vehicles/makes'); // Assuming this API endpoint exists
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMakes(data.makes);
      } catch (error) {
        console.error("Failed to fetch vehicle makes:", error);
        setMakesError("Failed to load vehicle makes.");
      } finally {
        setLoadingMakes(false);
      }
    };

    fetchMakes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm, 'with make:', selectedMake);
    // In a real application, this would trigger a search API call
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Product Search</h1>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Input */}
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
              Search Products
            </label>
            <input
              type="text"
              id="searchTerm"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter product name or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make Dropdown */}
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                Make
              </label>
              {loadingMakes ? (
                <p className="mt-1 text-gray-500">Loading makes...</p>
              ) : makesError ? (
                <p className="mt-1 text-red-500">{makesError}</p>
              ) : (
                <select
                  id="make"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                >
                  <option value="">All Makes</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {/* Add more filters here as needed */}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Search Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
        <p className="text-gray-500">No products found.</p>
        {/* Placeholder for actual search results */}
      </div>
    </div>
  );
};

export default SearchPage;
