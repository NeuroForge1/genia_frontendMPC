import React from 'react';
import { useUserPlanStore } from '@/services/store';
import { Coins } from 'lucide-react';

const CreditsBar: React.FC = () => {
  const { credits } = useUserPlanStore();

  // TODO: Add logic for total credits if available (e.g., from plan details)
  const totalCredits = 3000; // Placeholder
  const percentage = totalCredits > 0 ? (credits / totalCredits) * 100 : 0;

  return (
    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
      <Coins className="w-4 h-4 text-yellow-500" />
      <span className="text-sm font-medium text-gray-700">
        {credits.toLocaleString()}
      </span>
      <span className="text-sm text-gray-500">Créditos</span>
      {/* Optional: Progress bar */}
      {/* <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-2">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div> */}
    </div>
  );
};

export default CreditsBar;

