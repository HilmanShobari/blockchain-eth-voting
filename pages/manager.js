import React, { useState, useEffect } from 'react';
import { Card, Button, Grid, Container, Header, Segment, Icon, Label, Modal } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Voting from '../ethereum/voting';
import provider from '../ethereum/ethers';
import { getSaferSigner, checkMetaMaskStatus } from '../utils/ethersHelper';
import ErrorModal from '../components/ErrorModal';
import Layout from '../components/Layout';
import Link from 'next/link';
import AddAllowedVotersForm from '../components/AddAllowedVotersForm';
import CompletedVoteForm from '../components/CompletedVoteForm';
import withLoading from '../components/withLoading';
import LoadingPage from '../components/LoadingPage';

const ManagerPage = () => {
  const [myVotings, setMyVotings] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');


  useEffect(() => {
    const fetchMyVotings = async () => {
      try {
        console.log('Fetching my votings...');
        setLoading(true);
        
        // Check MetaMask status first
        const metamaskStatus = checkMetaMaskStatus();
        console.log('MetaMask status check:', metamaskStatus);
        
        if (metamaskStatus.status !== 'ready') {
          setError(metamaskStatus.message);
          return;
        }
        
        console.log('Getting signer using safer method...');
        const signer = await getSaferSigner();
        console.log('Signer obtained successfully');
        
        console.log('Getting account address...');
        const account = await signer.getAddress();
        console.log('Account address:', account);
        if (!account) {
          console.log('No account found');
          setError('No wallet connected');
          return;
        }
        setCurrentAccount(account);
        console.log('Current account:', account);

        const allVotings = await factory.getDeployedVotings();
        console.log('All votings:', allVotings);

        // Filter votings created by current user
        const votings = [];

        for (let address of allVotings) {
          try {
            console.log('Checking voting:', address);
            const voting = Voting(address);
            const contractDetail = await voting.getStatus();
            console.log('Contract detail:', contractDetail);

            const manager = contractDetail[0];
            const totalChoices = Number(contractDetail[1]); // Convert BigInt to Number
            const fromDate = Number(contractDetail[2]); // Convert BigInt to Number
            const endDate = Number(contractDetail[3]); // Convert BigInt to Number
            const completed = contractDetail[4];
            const totalVotersVoted = Number(contractDetail[5]); // Convert BigInt to Number
            const title = contractDetail[6] || `Voting ${address.slice(0, 6)}...`;

            console.log('Manager:', manager, 'Current:', account);

            if (manager.toLowerCase() === account.toLowerCase()) {
              function formatTimestamp(timestamp) {
                const date = new Date(timestamp * 1000);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
              }

              votings.push({
                address,
                title,
                totalChoices,
                fromDate: formatTimestamp(fromDate),
                endDate: formatTimestamp(endDate),
                completed,
                totalVotersVoted,
                endDateTimestamp: endDate,
              });
              console.log('Added voting:', title);
            }
          } catch (error) {
            console.error(`Error fetching voting ${address}:`, error);
          }
        }

        console.log('My votings:', votings);
        setMyVotings(votings);
      } catch (error) {
        console.error('Error fetching votings:', error);
        setError(error.message);
        setErrorDetails(error.stack || JSON.stringify(error));
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVotings();
  }, []);

  const renderMyVotings = () => {
    if (!myVotings || !Array.isArray(myVotings)) {
      return [];
    }

    const items = myVotings.map((voting) => {
      return (
        <Card key={voting.address} fluid style={{ marginBottom: '15px' }}>
          <Card.Content>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#2185d0', fontSize: '1.3em' }}>{voting.title}</span>
              <Label color={voting.completed ? 'red' : 'green'} size="small">
                {voting.completed ? 'Completed' : 'Active'}
              </Label>
            </Card.Header>
            <Card.Meta style={{ marginTop: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <div>
                  <Icon name="list" /> Choices: {voting.totalChoices}
                </div>
                <div>
                  <Icon name="users" /> Voted: {voting.totalVotersVoted}
                </div>
                <div>
                  <Icon name="calendar" /> Start: {voting.fromDate}
                </div>
                <div>
                  <Icon name="calendar check" /> End: {voting.endDate}
                </div>
              </div>
            </Card.Meta>
            <Card.Description style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/votings/${voting.address}`}>
                  <Button size="small" color="blue" icon labelPosition="left">
                    <Icon name="eye" />
                    View Details
                  </Button>
                </Link>
              </div>
            </Card.Description>
          </Card.Content>
        </Card>
      );
    });

    return items;
  };

  // Show loading
  if (loading) {
    return <LoadingPage message="Loading Manager Dashboard..." />;
  }

  // Show error if there's an error
  if (error) {
    return (
      <Layout>
        <Container style={{ padding: '20px 0' }}>
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#fff5f5',
              borderRadius: '10px',
              border: '2px dashed #e53e3e',
            }}>
            <Icon name="exclamation triangle" size="big" color="red" />
            <Header as="h3" style={{ color: '#e53e3e', marginTop: '15px' }}>
              Connection Error
            </Header>
            <p style={{ color: '#e53e3e' }}>{error || 'Unable to connect to the blockchain. Please check your wallet connection.'}</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container style={{ padding: '20px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            color: 'white',
            textAlign: 'center',
          }}>
          <Header as="h1" style={{ color: 'white', marginBottom: '10px' }}>
            <Icon name="settings" />
            Voting Manager Dashboard
          </Header>
          <p style={{ fontSize: '1.1em', opacity: '0.9' }}>Create and manage your voting campaigns</p>

          <Link href="/votings/new">
            <Button
              size="large"
              style={{
                background: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                marginTop: '15px',
              }}
              icon
              labelPosition="left">
              <Icon name="plus circle" />
              Create New Voting
            </Button>
          </Link>
        </div>

        <Segment style={{ padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Header as="h2" style={{ color: '#333', marginBottom: '20px' }}>
            <Icon name="list" color="blue" />
            My Voting Campaigns
          </Header>

          {!myVotings || myVotings.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                border: '2px dashed #dee2e6',
              }}>
              <Icon name="inbox" size="big" color="grey" />
              <Header as="h3" style={{ color: '#6c757d', marginTop: '15px' }}>
                No Voting Campaigns Yet
              </Header>
              <p style={{ color: '#6c757d' }}>Create your first voting campaign to get started!</p>
            </div>
          ) : (
            <div>{renderMyVotings()}</div>
          )}
        </Segment>
      </Container>
      
      {/* Error Modal */}
      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Connection Error"
        message={error}
        details={errorDetails}
      />
    </Layout>
  );
};

export default withLoading(ManagerPage);
