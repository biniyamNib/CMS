import React from 'react';

function ServicesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src="service1.jpg" alt="Service 1" className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-bold mb-2">Sustainable Building Practices</h3>
            <p>Embrace eco-friendly architecture with sustainable design solutions that reduce environmental impact.</p>
          </div>
          <div>
            <img src="service2.jpg" alt="Service 2" className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-bold mb-2">Innovative Design Solutions</h3>
            <p>Transform your vision into reality with cutting-edge architectural designs tailored to your unique needs and aesthetic preferences.</p>
          </div>
          <div>
            <img src="service3.jpg" alt="Service 3" className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-bold mb-2">Detailed Project Management</h3>
            <p>Experience seamless project execution with meticulous planning, budgeting, and oversight from concept to completion.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;