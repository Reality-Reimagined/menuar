import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, Eye, FilePen, Pizza, Plus, QrCode, Trash2 } from 'lucide-react';
import { useMenuContext } from '../context/MenuContext';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const { menus, createMenu, deleteMenu, generateQRCode, generateEmbedCode, initDemoMenu, storageAvailable } = useMenuContext();
  const { showToast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDesc, setNewMenuDesc] = useState('');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Check for storage availability
  useEffect(() => {
    if (!storageAvailable) {
      showToast('Local storage is not available. Your changes will not be saved between sessions.', 'error');
    }
  }, [storageAvailable, showToast]);

  const handleCreateMenu = () => {
    if (!newMenuName || !newRestaurantName) {
      showToast('Please provide both a menu name and restaurant name', 'error');
      return;
    }
    
    try {
      createMenu({
        name: newMenuName,
        description: newMenuDesc,
        restaurantName: newRestaurantName,
        items: [],
      });
      
      // Reset form
      setShowCreateForm(false);
      setNewMenuName('');
      setNewMenuDesc('');
      setNewRestaurantName('');
    } catch (error) {
      console.error('Error creating menu:', error);
      showToast('Failed to create menu. Please try again.', 'error');
    }
  };

  const handleGenerateQR = async (menuId: string) => {
    setIsGeneratingQR(true);
    try {
      const qrUrl = await generateQRCode(menuId);
      setQrCodeUrl(qrUrl);
      setSelectedMenuId(menuId);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      showToast('Failed to generate QR code', 'error');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleGenerateEmbed = (menuId: string) => {
    try {
      const code = generateEmbedCode(menuId);
      setEmbedCode(code);
      setShowEmbedModal(true);
    } catch (error) {
      console.error('Failed to generate embed code:', error);
      showToast('Failed to generate embed code', 'error');
    }
  };

  const handleCreateDemoMenu = () => {
    try {
      initDemoMenu();
      showToast('Demo pizza menu created!', 'success');
    } catch (error) {
      console.error('Failed to create demo menu:', error);
      showToast('Failed to create demo menu', 'error');
    }
  };

  const handleCopyEmbedCode = async () => {
    if (!embedCode) return;
    
    try {
      await navigator.clipboard.writeText(embedCode);
      showToast('Embed code copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for browser restrictions or older browsers
      const textArea = document.createElement('textarea');
      textArea.value = embedCode;
      textArea.style.position = 'fixed';  // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showToast('Embed code copied to clipboard!', 'success');
        } else {
          showToast('Failed to copy. Please copy manually.', 'error');
        }
      } catch (err) {
        showToast('Failed to copy. Please copy manually.', 'error');
      }
      
      document.body.removeChild(textArea);
    }
  };

  const handleDeleteMenu = (menuId: string) => {
    if (window.confirm('Are you sure you want to delete this menu? This action cannot be undone.')) {
      deleteMenu(menuId);
      showToast('Menu deleted', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My AR Menus</h1>
        <div className="flex gap-4">
          {menus.length === 0 && (
            <button
              onClick={handleCreateDemoMenu}
              className="btn-secondary flex items-center gap-2"
            >
              <Pizza size={18} />
              Create Demo Menu
            </button>
          )}
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Create New Menu
          </button>
        </div>
      </div>

      {/* Create Menu Form */}
      {showCreateForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Menu</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="menuName" className="block text-sm font-medium text-gray-700 mb-1">
                Menu Name <span className="text-red-500">*</span>
              </label>
              <input
                id="menuName"
                type="text"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                className="input-field"
                placeholder="e.g., Dinner Menu, Lunch Specials"
                required
              />
            </div>
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                id="restaurantName"
                type="text"
                value={newRestaurantName}
                onChange={(e) => setNewRestaurantName(e.target.value)}
                className="input-field"
                placeholder="Your restaurant name"
                required
              />
            </div>
            <div>
              <label htmlFor="menuDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="menuDesc"
                value={newMenuDesc}
                onChange={(e) => setNewMenuDesc(e.target.value)}
                className="input-field h-24"
                placeholder="Short description of your menu"
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleCreateMenu} 
                className="btn-primary"
                disabled={!newMenuName || !newRestaurantName}
              >
                Create Menu
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu List */}
      {menus.length === 0 ? (
        <div className="card text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No Menus Yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first AR menu to get started or try our demo pizza menu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCreateDemoMenu}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Pizza size={18} />
              Create Demo Menu
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create New Menu
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                {menu.logo && (
                  <img 
                    src={menu.logo} 
                    alt={`${menu.restaurantName} logo`} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-1">{menu.name}</h3>
                  <p className="text-gray-600 text-sm">{menu.restaurantName}</p>
                </div>
              </div>
              <p className="text-gray-500 mb-4 text-sm">
                {menu.description || 'No description provided'}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{menu.items.length} items</span>
                <span>
                  Updated: {new Date(menu.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="border-t pt-4 flex flex-wrap gap-2">
                <Link
                  to={`/editor/${menu.id}`}
                  className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  <FilePen size={16} />
                  Edit
                </Link>
                <Link
                  to={`/preview/${menu.id}`}
                  className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                >
                  <Eye size={16} />
                  Preview
                </Link>
                <button
                  onClick={() => handleGenerateQR(menu.id)}
                  disabled={isGeneratingQR}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <QrCode size={16} />
                  QR Code
                </button>
                <button
                  onClick={() => handleGenerateEmbed(menu.id)}
                  className="flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
                >
                  <Code size={16} />
                  Embed
                </button>
                <button
                  onClick={() => handleDeleteMenu(menu.id)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors ml-auto"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {qrCodeUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">QR Code for Your Menu</h3>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4">
              <img src={qrCodeUrl} alt="Menu QR Code" className="w-64 h-64" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Print this QR code and place it on your tables for customers to scan and view your AR menu.
            </p>
            <div className="flex gap-4">
              <a
                href={qrCodeUrl}
                download={`ar-menu-qr-${selectedMenuId}.png`}
                className="btn-primary flex-1 text-center"
              >
                Download
              </a>
              <button
                onClick={() => setQrCodeUrl(null)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Modal */}
      {showEmbedModal && embedCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Embed Code for Your Website</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap">{embedCode}</pre>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Copy this code and paste it into your website where you want the AR menu to appear.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCopyEmbedCode}
                className="btn-primary flex-1"
              >
                Copy Code
              </button>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
