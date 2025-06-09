import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

const Header = () => {
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <Link route="/">
        <a className="item" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>
          E Vote Block
        </a>
      </Link>
    </div>
  );
};

export default Header;
