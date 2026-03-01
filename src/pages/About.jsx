// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Target, Award, Heart, 
  Mail, Phone, Globe, MapPin 
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About TAM
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering travel agencies with cutting-edge technology since 2023
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-blue-50 p-8 rounded-2xl">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To revolutionize the travel agency industry by providing an all-in-one, 
                cloud-based management system that simplifies operations, automates workflows, 
                and drives growth for travel businesses of all sizes.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-8 rounded-2xl">
              <Award className="w-12 h-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the leading SaaS platform for travel agencies across Pakistan 
                and beyond, enabling thousands of businesses to digitize their operations 
                and scale efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Developed By</h2>
              <a 
                href="https://minorgroup.site" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl font-bold hover:underline"
              >
                www.minorgroup.site
              </a>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-center mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Muhammad Saim
              </h3>
              <p className="text-center text-blue-600 font-semibold mb-6">
                CEO & Lead Developer
              </p>
              
              <div className="max-w-2xl mx-auto">
                <p className="text-gray-600 text-center leading-relaxed mb-8">
                  With a passion for technology and deep understanding of the travel industry, 
                  Muhammad Saim founded TAM to bridge the gap between traditional travel agency 
                  operations and modern digital solutions. His vision is to empower travel 
                  businesses with tools that make management seamless and growth inevitable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-8">
                  <div className="text-center">
                    <Mail className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <a href="mailto:saimpkf@gmail.com" className="text-gray-600 hover:text-blue-600">
                      saimpkf@gmail.com
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <Phone className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <a href="tel:+923131471263" className="text-gray-600 hover:text-blue-600">
                      +92 313 1471263
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <Globe className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <a href="https://minorgroup.site" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      minorgroup.site
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Heart className="w-8 h-8" />, title: "Customer First", desc: "Your success is our priority" },
              { icon: <Award className="w-8 h-8" />, title: "Innovation", desc: "Constantly improving and evolving" },
              { icon: <Users className="w-8 h-8" />, title: "Integrity", desc: "Honest and transparent dealings" },
              { icon: <Target className="w-8 h-8" />, title: "Excellence", desc: "Delivering the best solutions" }
            ].map((value, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;