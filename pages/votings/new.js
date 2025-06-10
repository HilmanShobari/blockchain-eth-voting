import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message, Container, Header, Segment, Icon, Label } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import withLoading from '../../components/withLoading';

import 'react-datepicker/dist/react-datepicker.css';

const VotingNew = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [choices, setChoices] = useState(['', '']);
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage(false);

    try {
      // Validation
      if (!title.trim()) {
        throw new Error('Please enter a voting title');
      }
      
      const validChoices = choices.filter(choice => choice.trim() !== '');
      if (validChoices.length < 2) {
        throw new Error('Please enter at least 2 choices');
      }
      
      if (!endDate) {
        throw new Error('Please select an end date');
      }

      const startDateTimestamp = Math.floor(new Date().getTime() / 1000);
      const endDateTimestamp = Math.floor(endDate / 1000);

      const accounts = await web3.eth.getAccounts();
      await factory.methods.createVoting(
        title.trim(),
        validChoices,
        startDateTimestamp, 
        endDateTimestamp
      ).send({
        from: accounts[0],
      });

      router.push('/manager');
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  const handleEndDateChange = (date) => {
    const selectedDate = date;
    const currentDate = new Date();

    if (new Date(selectedDate) < currentDate) {
      alert('You cannot select a date before today');
      return;
    }
    setEndDate(selectedDate);
  };

  const addChoice = () => {
    setChoices([...choices, '']);
  };

  const removeChoice = (index) => {
    if (choices.length > 2) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
    }
  };

  const updateChoice = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  return (
    <Layout>
      <Container style={{ padding: '20px 0' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '15px', 
          padding: '30px', 
          marginBottom: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <Header as="h1" style={{ color: 'white', marginBottom: '10px' }}>
            <Icon name="plus circle" />
            Create New Voting Campaign
          </Header>
          <p style={{ fontSize: '1.1em', opacity: '0.9' }}>
            Set up a new blockchain-based voting campaign
          </p>
        </div>

        <Segment style={{ padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Form onSubmit={onSubmit} error={!!errorMessage}>
            
            {/* Title Field */}
            <Form.Field style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px', display: 'block' }}>
                <Icon name="header" color="blue" /> Voting Title
              </label>
              <Input 
                placeholder="Enter the title of your voting campaign" 
                value={title} 
                onChange={(event) => setTitle(event.target.value)}
                style={{ fontSize: '1.1em' }}
                size="large"
              />
            </Form.Field>

            {/* Choices Section */}
            <Form.Field style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '15px', display: 'block' }}>
                <Icon name="list" color="green" /> Voting Choices
              </label>
              
              {choices.map((choice, index) => (
                <div key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Label 
                    circular 
                    color="blue" 
                    size="large"
                    style={{ minWidth: '35px', textAlign: 'center' }}
                  >
                    {index + 1}
                  </Label>
                  <Input 
                    placeholder={`Enter choice ${index + 1}`}
                    value={choice}
                    onChange={(event) => updateChoice(index, event.target.value)}
                    style={{ flex: '1' }}
                    size="large"
                  />
                  {choices.length > 2 && (
                    <Button 
                      type="button"
                      icon="trash" 
                      color="red"
                      size="large"
                      onClick={() => removeChoice(index)}
                      style={{ borderRadius: '50%' }}
                    />
                  )}
                </div>
              ))}
              
              <Button 
                type="button"
                onClick={addChoice}
                icon
                labelPosition="left"
                color="green"
                style={{ marginTop: '10px', borderRadius: '20px' }}
                size="medium"
              >
                <Icon name="plus" />
                Add Choice
              </Button>
            </Form.Field>

            {/* End Date Field */}
            <Form.Field style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px', display: 'block' }}>
                <Icon name="calendar" color="orange" /> End Date & Time
              </label>
              <div style={{ 
                border: '1px solid #ddd', 
                borderRadius: '10px', 
                padding: '15px',
                backgroundColor: '#f8f9fb'
              }}>
                <DatePicker 
                  value={endDate} 
                  selected={endDate} 
                  onChange={(event) => handleEndDateChange(event)} 
                  showTimeSelect 
                  dateFormat="Pp"
                  placeholderText="Select end date and time"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    fontSize: '1.1em',
                    border: 'none',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </Form.Field>

            {/* Submit Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Button 
                loading={loading}
                size="huge"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '15px 40px',
                  fontWeight: 'bold'
                }}
                icon
                labelPosition="left"
              >
                <Icon name="rocket" />
                Create Voting Campaign
              </Button>
            </div>

            <Message 
              error 
              header="Error!" 
              content={errorMessage} 
              style={{ borderRadius: '10px', marginTop: '20px' }}
            />
            {successMessage && (
              <Message 
                positive 
                header="Success!" 
                content="Voting campaign created successfully!" 
                style={{ borderRadius: '10px', marginTop: '20px' }}
              />
            )}
          </Form>
        </Segment>
      </Container>
    </Layout>
  );
};

export default withLoading(VotingNew);
