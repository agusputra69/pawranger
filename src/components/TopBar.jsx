import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-primary-600 text-white py-2 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>info@pawranger.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>123 Pet Street, City, State 12345</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <span>🐾 Professional Pet Care Services Since 2020</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;