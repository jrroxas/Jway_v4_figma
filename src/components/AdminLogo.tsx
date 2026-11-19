import React from 'react';

export const AdminLogo: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem 0' }}>
      <img 
        src="/Logo-JWay.svg" 
        alt="JWay Group Logo" 
        style={{ 
          maxWidth: '180px', 
          maxHeight: '50px', 
          width: 'auto', 
          height: 'auto', 
          objectFit: 'contain' 
        }} 
      />
    </div>
  );
};

export default AdminLogo;
