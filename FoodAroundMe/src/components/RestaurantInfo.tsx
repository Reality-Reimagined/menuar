import { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, Map, MapPin, Phone } from 'lucide-react';

interface RestaurantInfoProps {
  logo?: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  isEditable?: boolean;
  onLogoChange?: (logo: string) => void;
  onInfoChange?: (field: string, value: string) => void;
}

const RestaurantInfo = ({
  logo,
  name,
  address,
  phone,
  website,
  latitude,
  longitude,
  isEditable = false,
  onLogoChange,
  onInfoChange,
}: RestaurantInfoProps) => {
  const [showMap, setShowMap] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onLogoChange) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && onLogoChange) {
        onLogoChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInfoChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (onInfoChange) {
      onInfoChange(field, e.target.value);
    }
  };

  const generateMapUrl = () => {
    if (!latitude || !longitude) return '';
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=17`;
  };

  const hasContactInfo = address || phone || website;
  const hasLocation = latitude && longitude;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isEditable ? (
            <div className="w-20 h-20 relative">
              {logo ? (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={logo} 
                    alt={`${name} logo`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-xs text-center">Upload Logo</span>
                </div>
              )}
              <label className="absolute inset-0 cursor-pointer rounded-full overflow-hidden">
                <span className="sr-only">Upload logo</span>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
          ) : logo ? (
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
              <img 
                src={logo} 
                alt={`${name} logo`} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          <div className="flex-1 text-center sm:text-left">
            {isEditable ? (
              <>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => handleInfoChange('name', e)}
                  className="text-xl font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Restaurant Name"
                />
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={address || ''} 
                      onChange={(e) => handleInfoChange('address', e)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Address"
                    />
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={phone || ''} 
                      onChange={(e) => handleInfoChange('phone', e)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="flex items-center">
                    <Globe size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={website || ''} 
                      onChange={(e) => handleInfoChange('website', e)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Website"
                    />
                  </div>
                  <div className="flex items-center">
                    <Map size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    <div className="flex gap-2 w-full">
                      <input 
                        type="text" 
                        value={latitude || ''} 
                        onChange={(e) => handleInfoChange('latitude', e)}
                        className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="Latitude"
                      />
                      <input 
                        type="text" 
                        value={longitude || ''} 
                        onChange={(e) => handleInfoChange('longitude', e)}
                        className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-1">{name}</h2>
                {hasContactInfo && (
                  <div className="text-gray-600 text-sm space-y-1">
                    {address && (
                      <div className="flex items-center">
                        <MapPin size={14} className="text-gray-400 mr-1 flex-shrink-0" />
                        <span>{address}</span>
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-center">
                        <Phone size={14} className="text-gray-400 mr-1 flex-shrink-0" />
                        <a href={`tel:${phone}`} className="hover:text-indigo-600">{phone}</a>
                      </div>
                    )}
                    {website && (
                      <div className="flex items-center">
                        <Globe size={14} className="text-gray-400 mr-1 flex-shrink-0" />
                        <a 
                          href={website.startsWith('http') ? website : `https://${website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600 truncate"
                        >
                          {website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                {hasLocation && (
                  <button
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        Hide Map
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        Show Map
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {!isEditable && showMap && hasLocation && (
        <div className="w-full h-64">
          <iframe 
            title={`Map of ${name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={generateMapUrl()}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default RestaurantInfo;
