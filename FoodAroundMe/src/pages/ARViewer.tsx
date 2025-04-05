import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CircleAlert, RefreshCw, Rotate3d, Smartphone, ZoomIn, ZoomOut } from 'lucide-react';
import { useMenuContext } from '../context/MenuContext';
import { useToast } from '../context/ToastContext';

// TypeScript declaration for Model Viewer elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'shadow-intensity'?: string;
        exposure?: string;
        'environment-image'?: string;
        loading?: string;
        'quick-look-browsers'?: string;
        reveal?: 'auto' | 'manual' | 'interaction';
        'animation-name'?: string;
        autoplay?: boolean;
        'field-of-view'?: string;
        'min-field-of-view'?: string;
        'max-field-of-view'?: string;
        'camera-orbit'?: string;
        'interaction-prompt'?: 'auto' | 'none';
        'interaction-prompt-style'?: 'basic' | 'wiggle';
        'interaction-prompt-threshold'?: string;
        ref?: React.RefObject<HTMLElement>;
        'ar-status'?: string;
        'ar-prompt'?: string;
      };
    }
  }
}

interface ModelViewerElement extends HTMLElement {
  cameraOrbit: string;
  fieldOfView: string;
  play: () => void;
  pause: () => void;
  resetTurntable: () => void;
  jumpCameraToGoal: () => void;
  [key: string]: any;
}

const ARViewer = () => {
  const { menuItemId } = useParams<{ menuItemId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getMenuItem } = useMenuContext();
  const [menuItem, setMenuItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [modelError, setModelError] = useState(false);
  const modelViewerRef = useRef<ModelViewerElement | null>(null);

  // Find the menu item
  useEffect(() => {
    if (!menuItemId) return;

    const item = getMenuItem(menuItemId);
    if (item) {
      setMenuItem(item);
    }
    
    setLoading(false);
  }, [menuItemId, getMenuItem]);

  // Control auto-rotation
  useEffect(() => {
    if (modelViewerRef.current) {
      if (autoRotate) {
        modelViewerRef.current.setAttribute('auto-rotate', '');
      } else {
        modelViewerRef.current.removeAttribute('auto-rotate');
      }
    }
  }, [autoRotate]);

  // Check if <model-viewer> custom element is defined
  useEffect(() => {
    const isModelViewerDefined = customElements.get('model-viewer');
    if (!isModelViewerDefined) {
      console.error('model-viewer custom element not defined!');
      setModelError(true);
      showToast('Error loading 3D viewer component. Please try again later.', 'error');
    }
  }, [showToast]);

  const handleZoomIn = () => {
    if (modelViewerRef.current) {
      const currentFOV = parseFloat(modelViewerRef.current.fieldOfView);
      const newFOV = Math.max(currentFOV - 10, 10);
      modelViewerRef.current.fieldOfView = `${newFOV}deg`;
    }
  };

  const handleZoomOut = () => {
    if (modelViewerRef.current) {
      const currentFOV = parseFloat(modelViewerRef.current.fieldOfView);
      const newFOV = Math.min(currentFOV + 10, 90);
      modelViewerRef.current.fieldOfView = `${newFOV}deg`;
    }
  };

  const handleReset = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.resetTurntable();
      modelViewerRef.current.fieldOfView = '45deg';
      modelViewerRef.current.jumpCameraToGoal();
    }
  };

  const handleModelError = () => {
    setModelError(true);
    showToast('Failed to load 3D model. Please try again later.', 'error');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-6">
            The menu item you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const renderModel = () => {
    if (modelError || !menuItem.modelUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <CircleAlert size={48} className="text-red-500 mb-4" />
          <p className="text-gray-700 font-medium mb-2">3D model not available</p>
          <p className="text-gray-500 text-sm max-w-xs text-center">
            {modelError 
              ? "There was an error loading the 3D model. Please try again later." 
              : "This menu item doesn't have a 3D model yet."}
          </p>
          {modelError && (
            <button 
              onClick={() => setModelError(false)} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    try {
      return (
        <>
          <model-viewer
            ref={(ref) => { modelViewerRef.current = ref as ModelViewerElement }}
            src={menuItem.modelUrl}
            alt={menuItem.name}
            poster={menuItem.images.front || ''}
            camera-controls
            auto-rotate
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            shadow-intensity="1"
            exposure="0.5"
            environment-image="neutral"
            loading="eager"
            ar-prompt="See Your Food in 3D"
            style={{ width: '100%', height: '100%' }}
            onError={handleModelError}
          >
            <button 
              slot="ar-button" 
              className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <Smartphone size={20} />
              See Your Food in 3D
            </button>
          </model-viewer>

          {/* 3D controls */}
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={() => setAutoRotate(!autoRotate)} 
              className={`p-2 rounded-full ${autoRotate ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
              title={autoRotate ? "Stop Rotation" : "Start Rotation"}
            >
              <Rotate3d size={20} />
            </button>
            <button 
              onClick={handleZoomIn} 
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={handleZoomOut} 
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <button 
              onClick={handleReset} 
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Reset View"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          
          <div className="mt-2 text-center text-sm text-gray-500">
            <p>Interact with the model using your mouse. On mobile devices, you can view in AR mode.</p>
          </div>
        </>
      );
    } catch (error) {
      console.error('Error rendering model-viewer:', error);
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <CircleAlert size={48} className="text-red-500 mb-4" />
          <p className="text-gray-700 font-medium mb-2">Error Loading 3D Model</p>
          <p className="text-gray-500 text-sm max-w-xs text-center">
            There was a problem loading the 3D model viewer. Please try again later.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">{menuItem.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="relative h-[400px] sm:h-[500px] w-full bg-gray-100 rounded-lg overflow-hidden">
            {renderModel()}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-3">{menuItem.name}</h2>
          <p className="text-indigo-600 text-xl font-medium mb-4">${menuItem.price.toFixed(2)}</p>
          <div className="border-t border-b py-4 mb-4">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">{menuItem.description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {menuItem.images.front && (
              <div className="bg-gray-100 rounded-lg overflow-hidden h-24">
                <img 
                  src={menuItem.images.front} 
                  alt={`${menuItem.name} - front view`} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {menuItem.images.back && (
              <div className="bg-gray-100 rounded-lg overflow-hidden h-24">
                <img 
                  src={menuItem.images.back} 
                  alt={`${menuItem.name} - back view`} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {menuItem.images.left && (
              <div className="bg-gray-100 rounded-lg overflow-hidden h-24">
                <img 
                  src={menuItem.images.left} 
                  alt={`${menuItem.name} - side view`} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Category</h3>
            <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-gray-700">
              {menuItem.category || 'Uncategorized'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARViewer;
