import React from 'react';
import { Menu, Container, Button, Icon } from 'semantic-ui-react';
import Link from 'next/link';

const Header = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        padding: '15px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '0',
      }}>
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Link href="/">
            <div
              style={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
              <Icon name="shield" size="large" />E Vote Block
            </div>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Header;
