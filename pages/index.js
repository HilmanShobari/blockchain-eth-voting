import React, { useState, useEffect } from 'react';
import { Card, Container, Header, Segment, Icon, Label, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Voting from '../ethereum/voting';
import Layout from '../components/Layout';
import Link from 'next/link';
import withLoading from '../components/withLoading';
import LoadingPage from '../components/LoadingPage';

const VotingIndex = () => {
  const [votings, setVotings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVotings = async () => {
      try {
        setLoading(true);
        console.log('Fetching deployed votings...');
        const allVotings = await factory.getDeployedVotings();
        console.log('All votings:', allVotings);

        const votingsWithDetails = [];

        for (let address of allVotings) {
          try {
            console.log('Processing voting:', address);
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

            function formatTimestamp(timestamp) {
              const date = new Date(timestamp * 1000);
              return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            }

            votingsWithDetails.push({
              address,
              title,
              totalChoices,
              fromDate: formatTimestamp(fromDate),
              endDate: formatTimestamp(endDate),
              completed,
              totalVotersVoted,
              manager,
              endDateTimestamp: endDate,
            });
          } catch (error) {
            console.error(`Error fetching voting ${address}:`, error);
          }
        }

        console.log('Final votings with details:', votingsWithDetails);
        setVotings(votingsWithDetails);
      } catch (error) {
        console.error('Error fetching votings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVotings();
  }, []);

  const renderVotings = () => {
    if (!votings || !Array.isArray(votings)) {
      return [];
    }

    const items = votings.map((voting) => {
      const currentTime = new Date().getTime();
      const endTime = parseInt(voting.endDateTimestamp) * 1000;
      const isActive = !voting.completed && currentTime <= endTime;

      return (
        <Card key={voting.address} fluid style={{ marginBottom: '20px', border: '1px solid #e1e5e9', borderRadius: '12px' }}>
          <Card.Content style={{ padding: '25px' }}>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ color: '#2c3e50', fontSize: '1.5em', fontWeight: 'bold' }}>{voting.title}</span>
              <Label color={voting.completed ? 'red' : isActive ? 'green' : 'orange'} size="medium" style={{ borderRadius: '20px' }}>
                {voting.completed ? 'Completed' : isActive ? 'Active' : 'Ended'}
              </Label>
            </Card.Header>

            <Card.Meta style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  padding: '15px',
                  backgroundColor: '#f8f9fb',
                  borderRadius: '8px',
                }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name="list" color="blue" style={{ marginRight: '8px' }} />
                  <span>
                    <strong>Choices:</strong> {voting.totalChoices}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name="users" color="green" style={{ marginRight: '8px' }} />
                  <span>
                    <strong>Votes:</strong> {voting.totalVotersVoted}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name="calendar" color="orange" style={{ marginRight: '8px' }} />
                  <span>
                    <strong>End:</strong> {voting.endDate}
                  </span>
                </div>
              </div>
            </Card.Meta>

            <Card.Description style={{ textAlign: 'center' }}>
              <Link href={`/votings/${voting.address}`}>
                <Button
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px 30px',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s ease',
                  }}
                  icon
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                  }}>
                  View Voting
                </Button>
              </Link>
            </Card.Description>
          </Card.Content>
        </Card>
      );
    });

    return items;
  };

  // Show loading
  if (loading) {
    return <LoadingPage message="Loading Voting Campaigns..." />;
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
            <p style={{ color: '#e53e3e' }}>Unable to connect to the blockchain. Please check your wallet connection.</p>
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
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
            }}></div>

          <Header as="h1" style={{ color: 'white', marginBottom: '15px', fontSize: '2.5em' }}>
            <Icon name="vote" />
            E-Vote Blockchain
          </Header>
          <p style={{ fontSize: '1.2em', opacity: '0.9', maxWidth: '600px', margin: '0 auto' }}>Secure, transparent, and decentralized voting system powered by blockchain technology</p>
        </div>

        <Segment style={{ padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <Header as="h2" style={{ color: '#2c3e50', margin: '0' }}>
              <Icon name="list" color="blue" />
              Available Voting Campaigns
            </Header>
          </div>

          {!votings || votings.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '15px',
                border: '2px dashed #dee2e6',
              }}>
              <Icon name="inbox" size="huge" color="grey" />
              <Header as="h3" style={{ color: '#6c757d', marginTop: '20px' }}>
                No Voting Campaigns Available
              </Header>
              <p style={{ color: '#6c757d', fontSize: '1.1em' }}>Check back later for new voting opportunities!</p>
            </div>
          ) : (
            <div>{renderVotings()}</div>
          )}
        </Segment>
      </Container>
    </Layout>
  );
};

export default withLoading(VotingIndex);
