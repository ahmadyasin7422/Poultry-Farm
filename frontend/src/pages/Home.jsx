import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const services = [
    {
      icon: '🐔',
      title: 'Flock Management',
      description: 'Track bird batches, breeds, mortality, and current flock counts efficiently.',
    },
    {
      icon: '🌾',
      title: 'Feed Management',
      description: 'Monitor feed types, quantities, costs, and consumption patterns.',
    },
    {
      icon: '🥚',
      title: 'Egg Production',
      description: 'Record daily egg collection with good and damaged egg tracking.',
    },
    {
      icon: '💰',
      title: 'Sales & Expenses',
      description: 'Manage sales, track expenses, and calculate farm profitability.',
    },
    {
      icon: '👥',
      title: 'Customer Management',
      description: 'Maintain customer records and purchase history in one place.',
    },
    {
      icon: '📈',
      title: 'Reports & Analytics',
      description: 'Generate daily, weekly, and monthly reports for informed decisions.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-farm-700 via-farm-600 to-farm-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Professional Poultry Farm Management System
            </h1>
            <p className="text-xl text-farm-100 mb-8">
              Streamline your poultry farm operations with our comprehensive management
              platform. Track birds, feed, eggs, sales, and expenses all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-white text-farm-700 hover:bg-farm-50 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Start Free Today
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a successful poultry farm, from flock tracking
              to financial reporting.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="card hover:shadow-md transition-shadow border-l-4 border-l-farm-500"
              >
                <span className="text-4xl mb-4 block">{service.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-farm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Farm System</h2>
              <p className="text-gray-600 mb-4">
                The Poultry Farm Management System is designed to help farmers manage
                every aspect of their poultry operations efficiently. Whether you run a
                small backyard flock or a large commercial farm, our platform scales
                with your needs.
              </p>
              <p className="text-gray-600 mb-6">
                Built with modern technology and a user-friendly interface, we make
                farm management simple, organized, and profitable. Track your birds,
                monitor egg production, manage feed costs, and analyze your financial
                performance with ease.
              </p>
              <ul className="space-y-3">
                {[
                  'Real-time dashboard with key metrics',
                  'Secure JWT authentication',
                  'Mobile-responsive design',
                  'Comprehensive reporting tools',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-farm-600">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-farm-600 rounded-2xl p-8 text-white text-center">
              <span className="text-8xl block mb-4">🐔</span>
              <h3 className="text-2xl font-bold mb-2">Trusted by Farmers</h3>
              <p className="text-farm-100">
                Join thousands of poultry farmers who trust our system to manage their
                daily operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Have questions? We would love to hear from you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card text-center">
              <span className="text-3xl block mb-3">📧</span>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-gray-600 text-sm">info@poultryfarm.com</p>
            </div>
            <div className="card text-center">
              <span className="text-3xl block mb-3">📞</span>
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
            </div>
            <div className="card text-center">
              <span className="text-3xl block mb-3">📍</span>
              <h3 className="font-semibold mb-1">Address</h3>
              <p className="text-gray-600 text-sm">123 Farm Road, Countryside</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-farm-800 text-farm-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Poultry Farm Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
