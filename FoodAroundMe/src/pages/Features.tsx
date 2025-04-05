import { useState } from 'react';
import { Menu as MenuIcon, Camera, Check, Code, CreditCard, Gift, Pizza, QrCode, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenuContext } from '../context/MenuContext';

const Features = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const { initDemoMenu } = useMenuContext();

  const features = {
    restaurants: [
      {
        title: '3D Menu Visualization',
        description: 'Showcase your dishes in stunning 3D, giving customers a detailed view before they order.',
        icon: <Smartphone size={24} className="text-indigo-600" />,
      },
      {
        title: 'Custom Menu Design',
        description: 'Customize the look and feel of your digital menu to match your restaurant\'s branding.',
        icon: <MenuIcon size={24} className="text-indigo-600" />,
      },
      {
        title: 'Instant Updates',
        description: 'Update your menu items, prices, or descriptions instantly without reprinting physical menus.',
        icon: <Zap size={24} className="text-indigo-600" />,
      },
      {
        title: 'Photo to 3D Conversion',
        description: 'Our advanced AI technology converts your food photos into realistic 3D models automatically.',
        icon: <Camera size={24} className="text-indigo-600" />,
      },
      {
        title: 'QR Code Generation',
        description: 'Generate QR codes that customers can scan to instantly view your AR menu on their devices.',
        icon: <QrCode size={24} className="text-indigo-600" />,
      },
      {
        title: 'Upsell Opportunities',
        description: 'Highlight special items and promotions to increase order value and customer satisfaction.',
        icon: <Gift size={24} className="text-indigo-600" />,
      },
    ],
    customers: [
      {
        title: 'Interactive Experience',
        description: 'View dishes in 3D and AR before ordering, ensuring expectations are met.',
        icon: <Smartphone size={24} className="text-indigo-600" />,
      },
      {
        title: 'Informed Decisions',
        description: 'See exactly what you\'ll be getting with detailed 3D visualization of menu items.',
        icon: <Check size={24} className="text-indigo-600" />,
      },
      {
        title: 'Contactless Menus',
        description: 'Access the menu on your personal device by scanning a QR code, enhancing hygiene.',
        icon: <QrCode size={24} className="text-indigo-600" />,
      },
      {
        title: 'Website Integration',
        description: 'View AR menus directly on a restaurant\'s website before visiting.',
        icon: <Code size={24} className="text-indigo-600" />,
      },
    ],
  };

  const demoItems = [
    {
      name: 'Classic Margherita',
      description: 'Fresh mozzarella, tomato sauce, basil, and extra virgin olive oil on our signature crust.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Pepperoni Supreme',
      description: 'Loaded with pepperoni, mozzarella cheese, and our special seasoned tomato sauce.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Vegetarian Delight',
      description: 'Bell peppers, mushrooms, onions, black olives, tomatoes, and mozzarella on our herb-infused crust.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
  ];

  const pricing = [
    {
      name: 'Basic',
      price: '$29',
      period: 'per month',
      description: 'Perfect for small restaurants just getting started with AR menus.',
      features: [
        'Up to 20 menu items',
        'Basic 3D model generation',
        'Custom QR code generation',
        'Standard support',
      ],
      button: 'Get Started',
      highlight: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: 'per month',
      description: 'Ideal for established restaurants looking to enhance customer experience.',
      features: [
        'Up to 50 menu items',
        'Advanced 3D model generation',
        'Custom branding options',
        'Website embed code',
        'Priority support',
      ],
      button: 'Get Started',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For restaurant chains and large establishments with specific needs.',
      features: [
        'Unlimited menu items',
        'Premium 3D model generation',
        'Full white-labeling',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
      ],
      button: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <div>
      {/* Feature Tabs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Features that Transform the Dining Experience
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AR menu platform offers powerful features for both restaurants and their customers.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'restaurants'
                    ? 'bg-white shadow text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('restaurants')}
              >
                For Restaurants
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'customers'
                    ? 'bg-white shadow text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('customers')}
              >
                For Customers
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features[activeTab as keyof typeof features].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
                  <div className="p-3 bg-indigo-50 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Menu Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Try Our Demo Menu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of AR menus firsthand with our interactive demo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {demoItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-indigo-600 font-medium">${item.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <Link 
                    to="/dashboard"
                    className="inline-flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-700"
                  >
                    View in 3D/AR <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Pizza className="mr-2" size={20} />
              Try Full Demo Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your restaurant's needs, with no hidden fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div 
                key={index} 
                className={`relative group ${
                  plan.highlight 
                    ? 'border-2 border-indigo-500 rounded-xl shadow-xl' 
                    : 'border border-gray-200 rounded-xl shadow-lg'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`p-8 ${plan.highlight ? 'pt-12' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="text-green-500 mr-2 flex-shrink-0 mt-1" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom solution for your business?</p>
            <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-600 text-base font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
              Contact our sales team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;