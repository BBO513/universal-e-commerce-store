
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';

// Define the Vehicle type
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
}

// Define the props for the page
interface AdminVehiclesProps {
  initialVehicles: Vehicle[];
}

export default function AdminVehiclesPage({ initialVehicles }: AdminVehiclesProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({ make: '', model: '', year: new Date().getFullYear() });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/admin/vehicles');
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleOpenModal = (vehicle: Vehicle | null = null) => {
    setSelectedVehicle(vehicle);
    setFormData(vehicle ? { make: vehicle.make, model: vehicle.model, year: vehicle.year } : { make: '', model: '', year: new Date().getFullYear() });
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'year' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.year) {
      setError('All fields are required.');
      return;
    }

    const url = selectedVehicle ? `/api/admin/vehicles/${selectedVehicle.id}` : '/api/admin/vehicles';
    const method = selectedVehicle ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save vehicle');
      }

      await fetchVehicles();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete vehicle');
      }

      await fetchVehicles();
      setIsConfirmationModalOpen(false);
      setVehicleToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Keep modal open to show error
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Vehicle
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.make}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.model}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(vehicle)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDeleteClick(vehicle)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
              <div className="mb-4">
                <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
                <input type="text" name="make" id="make" value={formData.make} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>
              <div className="mb-4">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>
              <div className="mb-6">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{selectedVehicle ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${vehicleToDelete?.make} ${vehicleToDelete?.model} (${vehicleToDelete?.year})? This action cannot be undone.`}
      />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || session.user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    };
  }

  try {
    // In a real application, you would fetch this from your database.
    // Using a mock fetch function for demonstration.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vehicles`);
    let initialVehicles: Vehicle[] = [];
    if (res.ok) {
        initialVehicles = await res.json();
    } else {
        console.error("Failed to fetch vehicles, using empty array.");
    }
    
    return {
      props: {
        session,
        initialVehicles,
      },
    };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return {
      props: {
        session,
        initialVehicles: [],
      },
    };
  }
};
