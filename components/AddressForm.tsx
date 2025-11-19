
import { useState, useEffect } from 'react';

interface AddressFormProps {
  initialData?: {
    id?: number;
    type?: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    is_default: boolean;
  };
  onSubmit: (addressData: any) => void;
  onCancel?: () => void;
}

export default function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const [street, setStreet] = useState(initialData?.street || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state, setState] = useState(initialData?.state || '');
  const [postcode, setPostcode] = useState(initialData?.postcode || '');
  const [isDefault, setIsDefault] = useState(initialData?.is_default || false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setStreet(initialData.street || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setPostcode(initialData.postcode || '');
      setIsDefault(initialData.is_default || false);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!street.trim()) newErrors.street = 'Street is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!postcode.trim()) newErrors.postcode = 'Postcode is required';
    else if (!/^\d{3,4}$/.test(postcode)) newErrors.postcode = 'Australian postcode must be 3 or 4 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        id: initialData?.id,
        street,
        city,
        state,
        postcode,
        isDefault,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm bg-white">
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
        <input
          type="text"
          id="street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm min-h-[44px]"
        />
        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm min-h-[44px]"
        />
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
        <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm min-h-[44px]"
        />
        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
      </div>
      <div>
        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">Postcode</label>
        <input
          type="text"
          id="postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm min-h-[44px]"
        />
        {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
      </div>
      <div className="flex items-center min-h-[44px]"> {/* Ensure checkbox area is large enough */}
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded min-w-[24px] min-h-[24px]" // Larger checkbox
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900 flex-grow py-2">Save as default address</label>
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px] min-w-[44px]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 min-h-[44px] min-w-[44px]"
        >
          {initialData?.id ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
}
