import React from "react";

const LandingPage = () => {
  return (
    <div className="font-sans text-[#333333] bg-white">
      {/* Navigation - Professional Blue Background */}
      <nav className="flex justify-between items-center p-4 bg-[#1E40AF] text-white border-b border-[#3B82F6]">
        <div className="flex space-x-8 items-center">
          <a href="#" className="font-medium text-sm hover:text-[#93C5FD]">Home</a>
          <a href="#" className="font-medium text-sm hover:text-[#93C5FD]">Features</a>
          <a href="#" className="font-medium text-sm hover:text-[#93C5FD]">Pricing</a>
          <a href="#" className="font-medium text-sm hover:text-[#93C5FD]">About</a>
          <span className="font-medium text-sm text-[#93C5FD]">+251 11-555-5585</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-[#3B82F6] border border-[#60A5FA] rounded-full py-1 px-4 text-sm w-32 text-white placeholder-[#93C5FD] focus:outline-none focus:ring-1 focus:ring-[#93C5FD]"
            />
          </div>
          <button className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-4 py-1 rounded-full font-medium text-sm border border-[#3B82F6]">
            REQUEST DEMO
          </button>
        </div>
      </nav>

      {/* Hero Section with Business Image */}
      <section className="relative">
        <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Business management"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-6 text-white">
            <h1 className="text-4xl font-bold mb-6 leading-tight">Streamline Your Business Operations</h1>
            <p className="mb-8 leading-relaxed text-lg">
              The Companies Management System (CMS) helps businesses of all sizes manage operations, compliance, and growth with a centralized, scalable solution.
            </p>
            <button className="bg-white text-blue-800 px-8 py-3 rounded-full font-medium hover:bg-gray-100">
              GET STARTED
            </button>
          </div>
        </div>
      </section>

      {/* Features Section with Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">Comprehensive Business Management Solutions</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Our CMS platform offers a complete suite of tools to manage all aspects of your business operations efficiently.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Company management"
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-900 to-transparent text-white">
              <h3 className="text-2xl font-bold">Company Registration & Management</h3>
              <p>Register and manage companies with diverse structures and business models</p>
            </div>
          </div>
          
          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1553484771-11998c592b9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Shareholder management"
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-900 to-transparent text-white">
              <h3 className="text-2xl font-bold">Shareholder & Equity Management</h3>
              <p>Track ownership, equity distribution, and shareholder information</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              title: "Organizational Structure", 
              description: "Define hierarchical structures and manage departments",
              icon: "🏢"
            },
            { 
              title: "License & Compliance", 
              description: "Track licenses and ensure regulatory compliance",
              icon: "📋"
            },
            { 
              title: "Role-Based Access Control", 
              description: "Secure system access with customizable user roles",
              icon: "🔒"
            },
            { 
              title: "Financial Reporting", 
              description: "Generate real-time financial dashboards and reports",
              icon: "📊"
            },
            { 
              title: "User Management", 
              description: "Manage user accounts with multi-company support",
              icon: "👥"
            },
            { 
              title: "Notification System", 
              description: "Get alerts for critical events and deadlines",
              icon: "🔔"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section with Pattern Background */}
      <section className="py-16 px-6 bg-[#F0F7FF] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="pattern-dots pattern-blue-400 pattern-opacity-100 pattern-size-4 w-full h-full"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits of Using CMS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { 
                title: "Centralized Management", 
                description: "Manage all company operations from a single platform, eliminating fragmented systems and data silos."
              },
              { 
                title: "Regulatory Compliance", 
                description: "Stay compliant with automated license tracking, renewal alerts, and audit trails."
              },
              { 
                title: "Operational Efficiency", 
                description: "Reduce manual errors and operational costs through automation and streamlined processes."
              },
              { 
                title: "Scalable Solution", 
                description: "Grow your business with a system that scales from small startups to large enterprises."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-blue-800">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Built with Modern Technology</h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Technology stack"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Robust & Scalable Architecture</h3>
            <p className="mb-6 text-gray-600">
              Our CMS is built on a modern 3-tier architecture using industry-leading technologies for performance, security, and scalability.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: "React.js", purpose: "Frontend UI" },
                { name: "Node.js/Express", purpose: "Backend API" },
                { name: "PostgreSQL", purpose: "Database" },
                { name: "Agile Methodology", purpose: "Development" }
              ].map((tech, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-blue-800">{tech.name}</p>
                  <p className="text-sm text-gray-600">{tech.purpose}</p>
                </div>
              ))}
            </div>
            
            <p className="text-gray-600">
              The system supports role-based access control, real-time notifications, and comprehensive reporting capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto bg-[#FAFAFA] rounded-xl">
        <h2 className="text-3xl font-bold mb-4 text-center">Trusted by Businesses Across Industries</h2>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          Our CMS solution serves diverse sectors with tailored functionality for each industry's unique needs.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Logistics'].map((industry) => (
            <div key={industry} className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow">
              <span className="font-medium text-gray-700 text-center">{industry}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to transform your business operations?</h3>
          <p className="mb-6 text-gray-600">Contact us for a personalized demo</p>
          <button className="bg-blue-800 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-900">
            REQUEST DEMO
          </button>
        </div>
      </section>

      {/* Final CTA with Background Image */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-blue-900 opacity-40"></div>
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Business growth"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="relative max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Streamline operations, ensure compliance, and drive growth</h2>
          <div className="flex justify-center space-x-12 mb-8">
            <div>
              <p className="text-4xl font-bold">99.9%</p>
              <p>System uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold">40%</p>
              <p>Operational efficiency</p>
            </div>
          </div>
          <button className="bg-white text-blue-800 px-8 py-3 rounded-full font-medium hover:bg-gray-100">
            GET STARTED TODAY
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Companies Management System</h2>
            <p className="mb-8">
              Developed by Yod Business Solution in partnership with Debre Berhan University. 
              Our mission is to revolutionize business operations across Africa's commercial landscape.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Development team"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Yod Business Solution</h3>
            <p className="mb-2">ICT Park, Addis Ababa</p>
            <p className="mb-6">Ethiopia</p>
            <p className="mb-2">+251 11-555-5585</p>
            <p className="mb-8">info@yodbusiness.com</p>
            <p className="text-gray-500">Copyright © {new Date().getFullYear()} Yod Business Solution PLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;