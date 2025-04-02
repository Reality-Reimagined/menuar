import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  images: {
    front?: string;
    back?: string;
    left?: string;
  };
  modelUrl?: string;
  category: string;
}

interface Menu {
  id: string;
  name: string;
  description: string;
  restaurantName: string;
  logo?: string;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  items: MenuItem[];
  createdAt: number;
  updatedAt: number;
  userId: string;
}

interface MenuContextType {
  menus: Menu[];
  createMenu: (menu: Omit<Menu, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Menu;
  updateMenu: (id: string, menu: Partial<Menu>) => void;
  deleteMenu: (id: string) => void;
  getMenu: (id: string) => Menu | undefined;
  addMenuItem: (menuId: string, item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (menuId: string, itemId: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (menuId: string, itemId: string) => void;
  generateQRCode: (menuId: string) => Promise<string>;
  generateEmbedCode: (menuId: string) => string;
  generateModelFromImages: (front: string, back?: string, left?: string) => Promise<string>;
  getMenuItem: (itemId: string) => MenuItem | undefined;
  initDemoMenu: () => void;
  storageAvailable: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

// Check if localStorage is available and has space
const checkLocalStorageAvailability = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Load menus from localStorage on initial render
  useEffect(() => {
    const available = checkLocalStorageAvailability();
    setStorageAvailable(available);
    
    if (available) {
      try {
        const savedMenus = localStorage.getItem('ar-menus');
        if (savedMenus) {
          // Try to decompress the data if it starts with our marker
          const decompressed = savedMenus.startsWith('COMPRESSED:') 
            ? decompressFromUTF16(savedMenus.replace('COMPRESSED:', ''))
            : savedMenus;
            
          if (decompressed) {
            const parsed = JSON.parse(decompressed);
            setMenus(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading menus from localStorage:', error);
        showToast('Error loading saved menus. Starting fresh.', 'error');
      }
    } else {
      showToast('Local storage is not available. Your changes will not be saved.', 'error');
    }
  }, [showToast]);

  // Filter menus based on user login status
  const filteredMenus = user 
    ? menus.filter(menu => menu.userId === user.id || !menu.userId)
    : menus.filter(menu => !menu.userId);

  // Save menus to localStorage whenever they change
  useEffect(() => {
    if (storageAvailable && menus.length > 0) {
      try {
        // Compress the data to save space in localStorage
        const compressed = `COMPRESSED:${compressToUTF16(JSON.stringify(menus))}`;
        localStorage.setItem('ar-menus', compressed);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        
        // Check if it's a quota error
        if (error instanceof DOMException && (
          error.name === 'QuotaExceededError' || 
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        )) {
          showToast('Storage limit reached. Try removing some menus or items.', 'error');
          
          // Try to clean up old data to make space
          try {
            // Remove the oldest menu if we have more than one
            if (menus.length > 1) {
              const sortedMenus = [...menus].sort((a, b) => a.createdAt - b.createdAt);
              const oldestMenu = sortedMenus[0];
              
              setMenus(current => current.filter(menu => menu.id !== oldestMenu.id));
              showToast(`Removed "${oldestMenu.name}" to free up space.`, 'info');
            }
          } catch (cleanupError) {
            console.error('Failed to clean up storage:', cleanupError);
          }
        } else {
          showToast('Failed to save changes.', 'error');
        }
      }
    }
  }, [menus, storageAvailable, showToast]);

  const createMenu = (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) {
      showToast('Please login to create a menu', 'error');
      throw new Error('User not authenticated');
    }
    
    const now = Date.now();
    const newMenu: Menu = {
      ...menuData,
      id: `menu-${now}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      userId: user.id,
    };
    
    try {
      setMenus(prevMenus => [...prevMenus, newMenu]);
      showToast('Menu created successfully!', 'success');
      return newMenu;
    } catch (error) {
      console.error('Error creating menu:', error);
      showToast('Failed to create menu.', 'error');
      throw error;
    }
  };

  const updateMenu = (id: string, menuData: Partial<Menu>) => {
    try {
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === id
            ? { ...menu, ...menuData, updatedAt: Date.now() }
            : menu
        )
      );
    } catch (error) {
      console.error('Error updating menu:', error);
      showToast('Failed to update menu.', 'error');
    }
  };

  const deleteMenu = (id: string) => {
    try {
      setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== id));
    } catch (error) {
      console.error('Error deleting menu:', error);
      showToast('Failed to delete menu.', 'error');
    }
  };

  const getMenu = (id: string) => {
    return menus.find((menu) => menu.id === id);
  };

  const getMenuItem = (itemId: string) => {
    for (const menu of menus) {
      const item = menu.items.find(item => item.id === itemId);
      if (item) return item;
    }
    return undefined;
  };

  const addMenuItem = (menuId: string, item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    try {
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === menuId
            ? {
                ...menu,
                items: [...menu.items, newItem],
                updatedAt: Date.now(),
              }
            : menu
        )
      );
      
      return newItem;
    } catch (error) {
      console.error('Error adding menu item:', error);
      showToast('Failed to add menu item.', 'error');
      throw error;
    }
  };

  const updateMenuItem = (menuId: string, itemId: string, itemData: Partial<MenuItem>) => {
    try {
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === menuId
            ? {
                ...menu,
                items: menu.items.map((item) =>
                  item.id === itemId ? { ...item, ...itemData } : item
                ),
                updatedAt: Date.now(),
              }
            : menu
        )
      );
    } catch (error) {
      console.error('Error updating menu item:', error);
      showToast('Failed to update menu item.', 'error');
    }
  };

  const deleteMenuItem = (menuId: string, itemId: string) => {
    try {
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === menuId
            ? {
                ...menu,
                items: menu.items.filter((item) => item.id !== itemId),
                updatedAt: Date.now(),
              }
            : menu
        )
      );
    } catch (error) {
      console.error('Error deleting menu item:', error);
      showToast('Failed to delete menu item.', 'error');
    }
  };

  // Generate QR code for specific menu preview
  const generateQRCode = async (menuId: string): Promise<string> => {
    try {
      const qrCode = await import('qrcode');
      const url = `${window.location.origin}/preview/${menuId}`;
      return await qrCode.toDataURL(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      showToast('Failed to generate QR code.', 'error');
      throw error;
    }
  };

  // Generate embed code for specific menu preview
  const generateEmbedCode = (menuId: string): string => {
    const url = `${window.location.origin}/preview/${menuId}`;
    return `<iframe src="${url}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
  };

  // This implementation uses the fal.ai API with proper authentication
  const generateModelFromImages = async (front: string, back?: string, left?: string): Promise<string> => {
    try {
      console.log('Generating 3D model from images', { front, back, left });
      
      // Get the API key from environment variables
      const apiKey = import.meta.env.VITE_FAL_API_KEY;
      
      if (!apiKey) {
        throw new Error('FAL API key not found. Please check your .env file.');
      }

      // Prepare image data for API call
      const imageData = {
        front_image_url: front,
      };
      
      if (back) {
        imageData.back_image_url = back;
      }
      
      if (left) {
        imageData.left_image_url = left;
      }
      
      // Show a processing toast
      showToast('Processing 3D model generation...', 'info');
      
      // Make the request to fal.ai API
      const response = await fetch('https://queue.fal.run/fal-ai/hunyuan3d/v2/multi-view/turbo', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.request_id) {
        throw new Error('No request ID returned from API');
      }
      
      // Poll for completion
      let isComplete = false;
      let resultData = null;
      
      while (!isComplete) {
        // Wait for 2 seconds between polling
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check status
        const statusResponse = await fetch(`https://queue.fal.run/fal-ai/hunyuan3d/requests/${data.request_id}/status`, {
          headers: {
            'Authorization': `Key ${apiKey}`,
          },
        });
        
        if (!statusResponse.ok) {
          throw new Error(`Status check failed with status ${statusResponse.status}`);
        }
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'COMPLETED') {
          isComplete = true;
          
          // Get the result
          const resultResponse = await fetch(`https://queue.fal.run/fal-ai/hunyuan3d/requests/${data.request_id}`, {
            headers: {
              'Authorization': `Key ${apiKey}`,
            },
          });
          
          if (!resultResponse.ok) {
            throw new Error(`Result fetch failed with status ${resultResponse.status}`);
          }
          
          resultData = await resultResponse.json();
        } else if (statusData.status === 'FAILED') {
          throw new Error('Model generation failed');
        }
        // If still processing, loop will continue
      }
      
      if (!resultData || !resultData.model_mesh || !resultData.model_mesh.url) {
        throw new Error('No model URL in result data');
      }
      
      showToast('3D model generated successfully!', 'success');
      return resultData.model_mesh.url;
    } catch (error) {
      console.error('Error generating 3D model:', error);
      showToast('Failed to generate 3D model. Using placeholder model instead.', 'error');
      return 'https://mocha-cdn.com/0195ef11-17ff-7de1-96d6-96b7a10f7516/pizza.glb';
    }
  };
  
  // Initialize a demo pizza menu
  const initDemoMenu = () => {
    // Check if we already have the demo menu
    const existingDemoMenu = menus.find(menu => menu.name === 'Pizza Paradise Menu');
    if (existingDemoMenu) return;
    
    try {
      const demoMenu = {
        name: 'Pizza Paradise Menu',
        description: 'Our specialty pizzas with fresh ingredients and homemade dough',
        restaurantName: 'Pizza Paradise',
        logo: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80',
        address: '123 Main Street, New York, NY 10001',
        phone: '(555) 123-4567',
        website: 'www.pizzaparadise.com',
        latitude: 40.7128,
        longitude: -74.0060,
        items: [],
      };
      
      const newMenu = createMenu(demoMenu);
      
      // Add 3 pizza items with the same GLB model but different descriptions
      const pizzaModel = 'https://mocha-cdn.com/0195ef11-17ff-7de1-96d6-96b7a10f7516/pizza.glb';
      
      addMenuItem(newMenu.id, {
        name: 'Classic Margherita',
        description: 'Fresh mozzarella, tomato sauce, basil, and extra virgin olive oil on our signature crust.',
        price: 12.99,
        category: 'Specialty Pizzas',
        images: {
          front: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        modelUrl: pizzaModel,
      });
      
      addMenuItem(newMenu.id, {
        name: 'Pepperoni Supreme',
        description: 'Loaded with pepperoni, mozzarella cheese, and our special seasoned tomato sauce.',
        price: 14.99,
        category: 'Specialty Pizzas',
        images: {
          front: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        modelUrl: pizzaModel,
      });
      
      addMenuItem(newMenu.id, {
        name: 'Vegetarian Delight',
        description: 'Bell peppers, mushrooms, onions, black olives, tomatoes, and mozzarella on our herb-infused crust.',
        price: 13.99,
        category: 'Specialty Pizzas',
        images: {
          front: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        },
        modelUrl: pizzaModel,
      });
      
      // Force update to ensure everything is saved
      setMenus(prevMenus => [...prevMenus]);
      
      showToast('Demo menu created successfully!', 'success');
    } catch (error) {
      console.error('Error creating demo menu:', error);
      showToast('Failed to create demo menu.', 'error');
    }
  };

  const value = {
    menus: filteredMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    generateQRCode,
    generateEmbedCode,
    generateModelFromImages,
    getMenuItem,
    initDemoMenu,
    storageAvailable,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
