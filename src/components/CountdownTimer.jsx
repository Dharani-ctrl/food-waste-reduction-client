import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiryDate) - new Date();
      if (difference <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        return;
      }
      
      const hours = Math.floor((difference / (1000 * 60 * 60)));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <div className={`flex items-center gap-2 font-medium ${isExpired ? 'text-red-600' : 'text-orange-500'}`}>
      <Clock size={16} /> 
      <span>{isExpired ? 'Expired' : `Expires in: ${timeLeft}`}</span>
    </div>
  );
};

export default CountdownTimer;
