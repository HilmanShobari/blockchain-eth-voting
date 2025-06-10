import React from 'react';
import { Modal, Header, Button, Icon, Message } from 'semantic-ui-react';
import { parseBlockchainError } from '../utils/errorHandler';

const ErrorModal = ({ open, onClose, title = 'Error', message, details }) => {
  console.log('ErrorModal raw message:', message);

  // Parse the error to get user-friendly message
  const parsedError = parseBlockchainError(message || details);

  console.log('Parsed error:', parsedError);
  return (
    <Modal open={open} onClose={onClose} size="small" style={{ textAlign: 'center' }}>
      <Modal.Header
        style={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          textAlign: 'center',
        }}>
        <Icon name="exclamation triangle" />
        {title}
      </Modal.Header>

      <Modal.Content style={{ padding: '30px' }}>
        <Message
          negative
          style={{
            border: 'none',
            boxShadow: 'none',
            background: '#fff5f5',
            textAlign: 'left',
          }}>
          <Message.Header style={{ color: '#e74c3c', marginBottom: '10px', fontSize: '1.2em' }}>{parsedError.message}</Message.Header>
        </Message>
      </Modal.Content>

      <Modal.Actions style={{ padding: '20px' }}>
        <Button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 30px',
            fontWeight: 'bold',
          }}
          size="large">
          <Icon name="checkmark" />
          Got it
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ErrorModal;
