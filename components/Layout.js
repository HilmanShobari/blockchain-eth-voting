import React from "react";
import Header from './Header';
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";

const Layout = (props) => {
    return (
        <div style={{ 
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <Header/>
            <div style={{ paddingTop: '0' }}>
                {props.children}
            </div>
        </div>
    );
};

export default Layout;