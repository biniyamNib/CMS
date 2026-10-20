import React from 'react';

function AboutSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row items-center space-y-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <img src="about-image.jpg" alt="About Image" className="w-full h-auto" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Unveil Our Exclusive Collections</h2>
          <p className="text-lg">
            Discover our latest collection: sustainable, innovative designs that blend modern elegance with timeless architectural beauty.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;