
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: any; // Product data for editing
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [sku, setSku] = useState(initialData?.sku || '');
  const [condition, setCondition] = useState(initialData?.condition || 'new');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>(
    initialData?.specifications || [{ key: '', value: '' }]
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories'); // Assuming this API exists
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    // In a real app, you'd iterate through files and append them
    // For mock, we just simulate one upload
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImages((prevImages) => [...prevImages, data.url]);
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error uploading image.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleAddSpecification = () => {
    setSpecifications((prevSpecs) => [...prevSpecs, { key: '', value: '' }]);
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications((prevSpecs) => prevSpecs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title,
        description,
        price: parseFloat(price),
        sku,
        condition,
        categoryId: parseInt(categoryId, 10),
        stock: parseInt(stock, 10),
        images,
        brand,
        specifications: specifications.filter(spec => spec.key && spec.value), // Filter out empty specs
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (AUD)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value, 10))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      {/* New Fields */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Image Uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <div className="mt-1 flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
          {loading && <p className="text-blue-500">Uploading...</p>}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
              <Image src={img} alt={`Product image ${index + 1}`} layout="fill" objectFit="cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Specifications</label>
        {specifications.map((spec, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <input
              type="text"
              placeholder="Key (e.g., Material)"
              value={spec.key}
              onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
              className="block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              placeholder="Value (e.g., Aluminum)"
              value={spec.value}
              onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
              className="block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="button"
              onClick={() => handleRemoveSpecification(index)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSpecification}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Specification
        </button>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
}
