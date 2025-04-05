import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { useMenuContext } from '../context/MenuContext';
import RestaurantInfo from '../components/RestaurantInfo';

const PreviewMenu = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const { getMenu } = useMenuContext();
  const [menu, setMenu] = useState(getMenu(menuId || ''));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (menu && menu.items.length > 0) {
      const categories = [...new Set(menu.items.map(item => item.category))];
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    }
  }, [menu]);

  if (!menu) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Menu Not Found</h2>
          <p className="text-gray-600 mb-6">
            The menu you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = [...new Set(menu.items.map(item => item.category))].filter(Boolean);
  
  // Filter items by active category
  const filteredItems = activeCategory 
    ? menu.items.filter(item => item.category === activeCategory)
    : menu.items;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Menu Preview</h1>
        </div>

        {/* Restaurant Info */}
        <div className="mb-8">
          <RestaurantInfo
            logo={menu.logo}
            name={menu.restaurantName}
            address={menu.address}
            phone={menu.phone}
            website={menu.website}
            latitude={menu.latitude}
            longitude={menu.longitude}
          />
        </div>

        {/* Category Navigation */}
        {categories.length > 0 && (
          <div className="overflow-x-auto mb-8">
            <div className="flex space-x-4 p-1">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">No items in this category.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    {item.images.front && (
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={item.images.front}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {item.modelUrl && (
                      <Link 
                        to={`/view/${item.id}`}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="View in AR"
                      >
                        <Smartphone size={20} className="text-indigo-600" />
                      </Link>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className="text-indigo-600 font-medium">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    {item.modelUrl && (
                      <Link 
                        to={`/view/${item.id}`}
                        className="inline-flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                      >
                        View in 3D/AR <span className="ml-1">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          <p>This is a preview of how your customers will see your menu.</p>
          <p>They can view items in 3D/AR by clicking on the AR-enabled items.</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewMenu;