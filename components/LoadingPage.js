import React from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(255, 255, 255, 0.9)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%'
      }}>
        {/* Animated Logo */}
        <div style={{
          marginBottom: '20px',
          animation: 'spin 2s linear infinite'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        
        <h2 style={{ 
          color: 'white', 
          marginBottom: '10px',
          fontSize: '1.5em'
        }}>
          {message}
        </h2>
        
        <p style={{ 
          color: 'rgba(255,255,255,0.8)', 
          fontSize: '1em',
          margin: '0'
        }}>
          Please wait while we process your request...
        </p>
        
        {/* Progress dots */}
        <div style={{ 
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: '50%',
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage; 