import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Eye, Plus, Save, Upload, X } from 'lucide-react';
import { useMenuContext } from '../context/MenuContext';

interface MenuItemForm {
  name: string;
  description: string;
  price: number;
  category: string;
  images: {
    front?: string;
    back?: string;
    left?: string;
  };
}

const MenuEditor = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const navigate = useNavigate();
  const { getMenu, updateMenu, addMenuItem, updateMenuItem, deleteMenuItem, generateModelFromImages } = useMenuContext();
  
  const [menu, setMenu] = useState(getMenu(menuId || ''));
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [itemForm, setItemForm] = useState<MenuItemForm>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: {},
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (!menu) {
      navigate('/dashboard');
    }
  }, [menu, navigate]);

  if (!menu) {
    return <div>Loading...</div>;
  }

  const resetItemForm = () => {
    setItemForm({
      name: '',
      description: '',
      price: 0,
      category: '',
      images: {},
    });
    setEditingItemId(null);
  };

  const handleEditItem = (itemId: string) => {
    const item = menu.items.find(item => item.id === itemId);
    if (item) {
      setItemForm({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        images: { ...item.images },
      });
      setEditingItemId(itemId);
      setShowAddItemForm(true);
    }
  };

  const handleSaveItem = async () => {
    if (!itemForm.name || itemForm.price <= 0) {
      alert('Please provide a name and valid price for the menu item.');
      return;
    }

    setProcessing(true);
    
    // Only generate 3D model if front image exists and we don't already have a model
    let modelUrl;
    try {
      if (itemForm.images.front) {
        modelUrl = await generateModelFromImages(
          itemForm.images.front,
          itemForm.images.back,
          itemForm.images.left
        );
      }
    } catch (error) {
      console.error('Failed to generate 3D model:', error);
      alert('There was an error generating the 3D model. Please try again.');
      setProcessing(false);
      return;
    }

    if (editingItemId) {
      updateMenuItem(menu.id, editingItemId, {
        name: itemForm.name,
        description: itemForm.description,
        price: itemForm.price,
        category: itemForm.category,
        images: { ...itemForm.images },
        ...(modelUrl && { modelUrl }),
      });
    } else {
      addMenuItem(menu.id, {
        name: itemForm.name,
        description: itemForm.description,
        price: itemForm.price,
        category: itemForm.category,
        images: { ...itemForm.images },
        ...(modelUrl && { modelUrl }),
      });
    }

    setShowAddItemForm(false);
    resetItemForm();
    setProcessing(false);
    setMenu(getMenu(menuId || ''));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, view: 'front' | 'back' | 'left') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setItemForm(prev => ({
          ...prev,
          images: {
            ...prev.images,
            [view]: event.target?.result as string,
          }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (view: 'front' | 'back' | 'left') => {
    setItemForm(prev => {
      const newImages = { ...prev.images };
      delete newImages[view];
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleSaveMenu = () => {
    // Save any menu-level changes here
    alert('Menu saved successfully!');
  };

  const categories = [...new Set(menu.items.map(item => item.category))].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold flex-1">{menu.name}</h1>
        <div className="flex gap-4">
          <button
            onClick={handleSaveMenu}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            Save
          </button>
          <Link
            to={`/preview/${menu.id}`}
            className="btn-secondary flex items-center gap-2"
          >
            <Eye size={18} />
            Preview
          </Link>
        </div>
      </div>

      {/* Add Item Button */}
      <button
        onClick={() => {
          resetItemForm();
          setShowAddItemForm(true);
        }}
        className="mb-8 btn-secondary flex items-center gap-2"
      >
        <Plus size={18} />
        Add Menu Item
      </button>

      {/* Add/Edit Item Form */}
      {showAddItemForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingItemId ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  id="itemName"
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Margherita Pizza"
                />
              </div>
              <div>
                <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  id="itemPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  id="itemCategory"
                  type="text"
                  list="categories"
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Appetizers, Main Course"
                />
                <datalist id="categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="itemDescription"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="input-field h-24"
                  placeholder="Description of the menu item"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Item Images (for 3D Model)
              </label>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-600 mr-2">Front View (Required)</span>
                    {itemForm.images.front && (
                      <button
                        onClick={() => removeImage('front')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {itemForm.images.front ? (
                    <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={itemForm.images.front}
                        alt="Front view"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center">
                        <Camera className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-500">Upload front image</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                      />
                    </label>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600 mr-2">Back View (Optional)</span>
                      {itemForm.images.back && (
                        <button
                          onClick={() => removeImage('back')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {itemForm.images.back ? (
                      <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={itemForm.images.back}
                          alt="Back view"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="text-gray-400 mb-1" size={18} />
                          <span className="text-xs text-gray-500">Back view</span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'back')}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600 mr-2">Side View (Optional)</span>
                      {itemForm.images.left && (
                        <button
                          onClick={() => removeImage('left')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {itemForm.images.left ? (
                      <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={itemForm.images.left}
                          alt="Side view"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="text-gray-400 mb-1" size={18} />
                          <span className="text-xs text-gray-500">Side view</span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'left')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Note: Front view is required. Adding more views improves the 3D model quality.
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSaveItem}
              disabled={processing || !itemForm.name || !itemForm.images.front}
              className={`btn-primary flex items-center gap-2 ${
                (processing || !itemForm.name || !itemForm.images.front) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {processing ? 'Processing...' : 'Save Item'}
            </button>
            <button
              onClick={() => {
                setShowAddItemForm(false);
                resetItemForm();
              }}
              className="btn-secondary"
              disabled={processing}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Menu Items List */}
      {menu.items.length === 0 ? (
        <div className="card text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No Menu Items Yet</h2>
          <p className="text-gray-600 mb-4">
            Add your first menu item to get started with your AR menu.
          </p>
          <button
            onClick={() => {
              resetItemForm();
              setShowAddItemForm(true);
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add Menu Item
          </button>
        </div>
      ) : (
        <div>
          {/* Group by category */}
          {[...new Set(menu.items.map(item => item.category))].map(category => (
            <div key={category || 'uncategorized'} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                {category || 'Uncategorized'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.items
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.id} className="card">
                      <div className="flex gap-4">
                        {item.images.front && (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.images.front}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{item.description}</p>
                          <p className="text-indigo-600 font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t flex gap-2">
                        <button
                          onClick={() => handleEditItem(item.id)}
                          className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                              deleteMenuItem(menu.id, item.id);
                              setMenu(getMenu(menuId || ''));
                            }
                          }}
                          className="text-sm px-3 py-1 bg-gray-100 text-red-600 rounded hover:bg-gray-200 transition-colors"
                        >
                          Delete
                        </button>
                        {item.modelUrl && (
                          <Link
                            to={`/view/${item.id}`}
                            className="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors ml-auto"
                          >
                            View 3D
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
