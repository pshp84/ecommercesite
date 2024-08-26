import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-800 text-center">
      <p className="text-2xl font-semibold mt-4">{message}</p>
    </div>
  );
};

export default EmptyState;
