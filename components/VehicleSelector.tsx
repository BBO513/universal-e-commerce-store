import React, { useState, useEffect } from 'react';

interface VehicleSelection {
  make: string;
  model: string;
  year: number;
}

interface VehicleSelectorProps {
  onVehicleSelect?: (vehicle: VehicleSelection | null) => void;
}

const LOCAL_STORAGE_KEY = 'selectedVehicle';

export default function VehicleSelector({ onVehicleSelect }: VehicleSelectorProps) {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');

  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [error, setError] = useState('');

  // Load saved vehicle from local storage on mount
  useEffect(() => {
    const savedVehicle = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedVehicle) {
      const { make, model, year } = JSON.parse(savedVehicle);
      setSelectedMake(make);
      setSelectedModel(model);
      setSelectedYear(year);
      if (onVehicleSelect) {
        onVehicleSelect({ make, model, year });
      }
    }
  }, []);

  // Fetch Makes
  useEffect(() => {
    const fetchMakes = async () => {
      setLoadingMakes(true);
      setError('');
      try {
        const res = await fetch('/api/vehicles/makes');
        if (!res.ok) throw new Error('Failed to fetch makes');
        const data = await res.json();
        setMakes(data.makes);
      } catch (err: any) {
        setError(err.message || 'Error fetching makes.');
      } finally {
        setLoadingMakes(false);
      }
    };
    fetchMakes();
  }, []);

  // Fetch Models when Make changes
  useEffect(() => {
    if (selectedMake) {
      const fetchModels = async () => {
        setLoadingModels(true);
        setError('');
        try {
          const res = await fetch(`/api/vehicles/models?make=${selectedMake}`);
          if (!res.ok) throw new Error('Failed to fetch models');
          const data = await res.json();
          setModels(data.models);
          setSelectedModel(''); // Reset model when make changes
          setSelectedYear(''); // Reset year when make changes
        } catch (err: any) {
          setError(err.message || 'Error fetching models.');
        } finally {
          setLoadingModels(false);
        }
      };
      fetchModels();
    } else {
      setModels([]);
      setSelectedModel('');
      setYears([]);
      setSelectedYear('');
    }
  }, [selectedMake]);

  // Fetch Years when Model changes
  useEffect(() => {
    if (selectedMake && selectedModel) {
      const fetchYears = async () => {
        setLoadingYears(true);
        setError('');
        try {
          const res = await fetch(`/api/vehicles/years?make=${selectedMake}&model=${selectedModel}`);
          if (!res.ok) throw new Error('Failed to fetch years');
          const data = await res.json();
          setYears(data.years);
          setSelectedYear(''); // Reset year when model changes
        } catch (err: any) {
          setError(err.message || 'Error fetching years.');
        } finally {
          setLoadingYears(false);
        }
      };
      fetchYears();
    } else {
      setYears([]);
      setSelectedYear('');
    }
  }, [selectedMake, selectedModel]);

  // Save to local storage and call callback when selection is complete
  useEffect(() => {
    if (selectedMake && selectedModel && selectedYear) {
      const vehicle = { make: selectedMake, model: selectedModel, year: selectedYear as number };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vehicle));
      if (onVehicleSelect) {
        onVehicleSelect(vehicle);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      if (onVehicleSelect) {
        onVehicleSelect(null);
      }
    }
  }, [selectedMake, selectedModel, selectedYear, onVehicleSelect]);

  const handleClearSelection = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (onVehicleSelect) {
      onVehicleSelect(null);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Select Your Vehicle</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
          <select
            id="make"
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            disabled={loadingMakes}
          >
            <option value="">Select Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            disabled={!selectedMake || loadingModels}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            disabled={!selectedModel || loadingYears}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {(selectedMake || selectedModel || selectedYear) && (
        <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 font-medium">
            Selected Vehicle: {selectedMake} {selectedModel} {selectedYear}
          </p>
          <button
            onClick={handleClearSelection}
            className="px-3 py-1 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
