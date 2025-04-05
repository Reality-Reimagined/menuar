import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ChevronRight, Globe, Menu as MenuIcon, QrCode, Scan, Smartphone, Sparkles } from 'lucide-react';

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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Menu with Food<span className="text-pink-400">AR</span>oundMe
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Create stunning interactive 3D menus for your restaurant in minutes. Turn simple photos into immersive AR experiences that delight your customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
                </Link>
                <Link 
                  to="/features" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/20 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  See How It Works
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-4 text-white/80 text-sm">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Free demo available
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-white/10 rounded-2xl backdrop-blur-xl transform rotate-6"></div>
              <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1505826759037-406b40feb4cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="AR Menu Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center transform rotate-45">
                    <span className="text-white font-bold text-xl transform -rotate-45">AR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-white">
            <path d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Features that Elevate Your Restaurant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AR menu platform offers everything you need to create an immersive dining experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
                <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Smartphone className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive AR Experience</h3>
                <p className="text-gray-600">
                  Let customers view your dishes in 3D before ordering, enhancing their understanding and excitement.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Camera className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered 3D Generation</h3>
                <p className="text-gray-600">
                  Simply upload photos of your dishes and our AI transforms them into detailed 3D models automatically.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
                <div className="rounded-full bg-pink-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <QrCode className="text-pink-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy QR Code Access</h3>
                <p className="text-gray-600">
                  Generate QR codes that customers can scan to instantly view your AR menu on their devices.
                </p>
              </div>
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
              <div className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
              <p className="text-gray-600">
                Upload multiple photos of your menu items from different angles.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate 3D Models</h3>
              <p className="text-gray-600">
                Our AI technology converts your photos into realistic 3D models.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Your Menu</h3>
              <p className="text-gray-600">
                Organize your menu items and customize the appearance to match your brand.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4">
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
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Restaurant Experience?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Join hundreds of restaurants that are delighting their customers with interactive AR menus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
            </Link>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/20 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              Try Demo Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;