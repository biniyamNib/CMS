import React from 'react';

function PartnersSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Partners and testimonials</h2>
        <p className="text-lg mb-8 text-center">
          Use this section to enhance your company’s reputation.
          <br />
          <a href="#" className="text-green-500 hover:underline">See our project showcases →</a>
        </p>
        <div className="flex justify-center space-x-8 mb-8">
          <img src="partner1.svg" alt="Partner 1" className="h-8" />
          <img src="partner2.svg" alt="Partner 2" className="h-8" />
          <img src="partner3.svg" alt="Partner 3" className="h-8" />
          <img src="partner4.svg" alt="Partner 4" className="h-8" />
          <img src="partner5.svg" alt="Partner 5" className="h-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src="partner-testimonial.jpg" alt="Testimonial" className="w-full h-48 object-cover mb-4" />
            <p className="text-lg italic">"Their attention to detail and commitment to sustainability are unmatched."</p>
            <p className="text-lg font-bold">John Doe, CEO, XYZ Corp</p>
          </div>
          {/* Add more testimonials as needed */}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;