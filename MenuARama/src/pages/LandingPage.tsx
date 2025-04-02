import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, Camera, Gift, QrCode, Scan, Smartphone } from 'lucide-react';

const LandingPage = () => {
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transform Your Menu with Augmented Reality
              </h1>
              <p className="text-xl mb-8">
                Create interactive AR menus that bring your dishes to life with 3D models, enhancing the dining experience for your customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="btn-primary bg-white text-indigo-600 hover:bg-gray-100">
                  Create Your AR Menu
                </Link>
                <a href="#how-it-works" className="btn-secondary bg-transparent text-white border-white hover:bg-white/10">
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl transform rotate-3">
                <img 
                  src="https://images.unsplash.com/photo-1505826759037-406b40feb4cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="AR Menu Preview" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L80,106.7C160,117,320,139,480,149.3C640,160,800,160,960,138.7C1120,117,1280,75,1360,53.3L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features that Elevate Your Restaurant</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AR menu platform offers everything you need to create an immersive dining experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card transition-transform hover:-translate-y-2">
              <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Smartphone className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive AR Experience</h3>
              <p className="text-gray-600">
                Let customers view your dishes in 3D before ordering, enhancing their understanding and excitement.
              </p>
            </div>
            
            <div className="card transition-transform hover:-translate-y-2">
              <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <MenuIcon className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Menu Creation</h3>
              <p className="text-gray-600">
                Design beautiful digital menus that reflect your brand and showcase your dishes in the best light.
              </p>
            </div>
            
            <div className="card transition-transform hover:-translate-y-2">
              <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Scan className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy QR Code Access</h3>
              <p className="text-gray-600">
                Generate QR codes that customers can scan to instantly view your AR menu on their own devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creating your AR menu is simple with our easy-to-use platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
              <p className="text-gray-600">
                Upload multiple photos of your menu items from different angles.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate 3D Models</h3>
              <p className="text-gray-600">
                Our AI technology converts your photos into realistic 3D models.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Your Menu</h3>
              <p className="text-gray-600">
                Organize your menu items and customize the appearance to match your brand.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Share with Customers</h3>
              <p className="text-gray-600">
                Generate QR codes or embed on your website for customers to access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Restaurant Experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of restaurants that are delighting their customers with interactive AR menus.
          </p>
          <Link to="/dashboard" className="btn-primary bg-white text-indigo-600 hover:bg-gray-100">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
