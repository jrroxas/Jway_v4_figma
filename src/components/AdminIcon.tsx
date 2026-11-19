import React from 'react';

export const AdminIcon: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', maxWidth: '130px', overflow: 'hidden' }}>
      <img 
        src="/Logo-JWay.svg" 
        alt="JWay Icon" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '28px', 
          width: 'auto', 
          height: 'auto', 
          objectFit: 'contain' 
        }} 
      />
    </div>
  );
};

export default AdminIcon;
