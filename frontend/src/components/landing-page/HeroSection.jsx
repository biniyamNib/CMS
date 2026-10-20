import React from 'react';

function HeroSection() {
  return (
    <section className="py-20 bg-cover bg-center" style={{ backgroundImage: "url('hero-bg.jpg')" }}>
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-4">Architectural Excellence for Corporate Success</h1>
        <p className="text-lg mb-8">
          Our architectural solutions combine design excellence with business acumen, creating spaces that inspire and support your corporate goals.
          Transform your workspace with our expertise.
        </p>
        <button className="bg-green-500 text-white px-6 py-3 rounded-md">START A PROJECT</button>
      </div>
    </section>
  );
}

export default HeroSection;