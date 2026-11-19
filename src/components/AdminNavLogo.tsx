import React from 'react';

export const AdminNavLogo: React.FC = () => {
  return (
    <div style={{ 
      padding: '0.5rem 0 1.5rem 0', 
      display: 'flex', 
      justifyContent: 'flex-start', 
      alignItems: 'center', 
      width: '100%', 
      borderBottom: '1px solid #1e293b', 
      marginBottom: '1.5rem' 
    }}>
      <img 
        src="/Logo-JWay.svg" 
        alt="JWay Group Logo" 
        style={{ 
          maxWidth: '140px', 
          height: '32px', 
          objectFit: 'contain' 
        }} 
      />
    </div>
  );
};

export default AdminNavLogo;
