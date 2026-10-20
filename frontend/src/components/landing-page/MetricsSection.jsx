import React from 'react';

function MetricsSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Key Metrics of Company's Achievements</h2>
        <p className="text-lg mb-8">
          From revenue growth to customer retention and market expansion, our key metrics of company achievements underscore our strategic prowess and dedication to driving sustainable business success.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-4xl font-bold">20%</h3>
            <p className="text-lg">Annual revenue growth</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">$75M</h3>
            <p className="text-lg">Projected revenue</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">200,000</h3>
            <p className="text-lg">Website visitors</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">90%</h3>
            <p className="text-lg">Client satisfaction</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">150+</h3>
            <p className="text-lg">Construction projects completed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">5x</h3>
            <p className="text-lg">Project turnover</p>
          </div>
        </div>
        <button className="bg-pink-500 text-white px-4 py-2 mt-8 rounded-md">MORE INFORMATION</button>
      </div>
    </section>
  );
}

export default MetricsSection;