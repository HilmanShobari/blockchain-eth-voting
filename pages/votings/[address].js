import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Voting from '../../ethereum/voting';
import web3 from '../../ethereum/web3';
import { Form, Radio, Message, Button, Card, Grid, Container, Header, Segment, Icon, Label, Progress, Statistic } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import AddAllowedVotersForm from '../../components/AddAllowedVotersForm';
import CompletedVoteForm from '../../components/CompletedVoteForm';
import withLoading from '../../components/withLoading';
import LoadingPage from '../../components/LoadingPage';

const VotingShow = ({ address }) => {
  const router = useRouter();
  const [votingData, setVotingData] = useState({
    choiceVotes: [],
    choiceNames: [],
    manager: '',
    totalChoices: 0,
    fromDate: { date: '', time: '', timestamp: 0 },
    endDate: { date: '', time: '', timestamp: 0 },
    completed: false,
    totalVotersVoted: 0,
    title: 'Loading...',
    currentAccount: '',
    isManager: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVotingData = async () => {
      try {
        setLoading(true);
        const votingAddress = address || router.query.address;
        
        if (!votingAddress) {
          setError('No voting address provided');
          return;
        }

        const voting = Voting(votingAddress);
        const contractDetail = await voting.methods.getStatus().call();

        let choiceVotes = [];
        let choiceNames = [];
        const totalChoices = contractDetail[1];

        // Get choice names
        try {
          choiceNames = await voting.methods.getAllChoiceNames().call();
        } catch (error) {
          // Fallback for older contracts without choice names
          for (let i = 0; i < totalChoices; i++) {
            choiceNames.push(`Choice ${i + 1}`);
          }
        }

        // Get vote counts
        for (let i = 0; i < totalChoices; i++) {
          const votes = await voting.methods.getVotes(i).call();
          choiceVotes.push(Number(votes)); // Convert BigInt to Number
        }

        function formatTimestamp(timestamp) {
          const date = new Date(timestamp * 1000);
          return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            timestamp: timestamp
          };
        }

        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];

        setVotingData({
          address: votingAddress,
          choiceVotes,
          choiceNames,
          manager: contractDetail[0],
          totalChoices: Number(contractDetail[1]), // Convert BigInt to Number
          fromDate: formatTimestamp(Number(contractDetail[2])), // Convert BigInt to Number
          endDate: formatTimestamp(Number(contractDetail[3])), // Convert BigInt to Number
          completed: contractDetail[4],
          totalVotersVoted: Number(contractDetail[5]), // Convert BigInt to Number
          title: contractDetail[6] || `Voting ${votingAddress.slice(0, 6)}...`,
          currentAccount,
          isManager: contractDetail[0].toLowerCase() === currentAccount.toLowerCase()
        });
      } catch (error) {
        console.error('Error fetching voting data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVotingData();
  }, [address]);

  const onSubmitVoting = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage(false);

    try {
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(votingData.address);
      await voting.methods.vote(value).send({ from: accounts[0] });
      setSuccessMessage(true);
      router.push(`/votings/${votingData.address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setSubmitting(false);
  };

  const onChoiceChange = (event, { value: selectedValue }) => {
    setValue(selectedValue);
    setErrorMessage('');
    setSuccessMessage(false);
  };

  const getTotalVotes = () => {
    return votingData.choiceVotes.reduce((sum, votes) => sum + Number(votes), 0);
  };

  const getVotePercentage = (votes) => {
    const total = getTotalVotes();
    return total > 0 ? ((Number(votes) / total) * 100).toFixed(1) : 0;
  };

  const renderChoices = () => {
    const choices = [];
    const totalVotes = getTotalVotes();
    
    for (let i = 0; i < votingData.totalChoices; i++) {
      const votes = Number(votingData.choiceVotes[i]);
      const percentage = getVotePercentage(votes);
      
      choices.push(
        <Card key={i} fluid style={{ marginBottom: '20px', border: '1px solid #e1e5e9', borderRadius: '12px' }}>
          <Card.Content style={{ padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <Card.Header style={{ color: '#2c3e50', fontSize: '1.3em', flex: '1' }}>
                {votingData.choiceNames[i] || `Choice ${i + 1}`}
              </Card.Header>
              <div style={{ textAlign: 'right' }}>
                <Statistic size="small" style={{ margin: '0' }}>
                  <Statistic.Value style={{ color: '#667eea' }}>{votes}</Statistic.Value>
                  <Statistic.Label>votes</Statistic.Label>
                </Statistic>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Vote Progress</span>
                <span style={{ fontSize: '0.9em', color: '#7f8c8d' }}>{percentage}%</span>
              </div>
              <Progress 
                percent={percentage} 
                color="blue" 
                size="medium"
              />
            </div>
            
            {!votingData.completed && !votingData.isManager && (
              <Form onSubmit={onSubmitVoting} error={!!errorMessage}>
                <Form.Field>
                  <div style={{ 
                    padding: '15px',
                    backgroundColor: value === i ? '#f0f8ff' : '#f8f9fb',
                    borderRadius: '8px',
                    border: value === i ? '2px solid #667eea' : '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <Radio 
                        label={<span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Select this choice</span>}
                        name="radioGroup" 
                        value={i} 
                        checked={value === i} 
                        onChange={onChoiceChange}
                        style={{ fontSize: '1.1em' }}
                      />
                    </div>
                    
                    {value === i && (
                      <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <Button 
                          loading={submitting} 
                          style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            fontWeight: 'bold'
                          }}
                          icon
                          labelPosition="left"
                          size="large"
                        >
                          <Icon name="checkmark" />
                          Vote Now!
                        </Button>
                      </div>
                    )}
                  </div>
                </Form.Field>
                
                {value === i && errorMessage && (
                  <Message error header="Error!" content={errorMessage} style={{ marginTop: '10px' }} />
                )}
                {value === i && successMessage && (
                  <Message positive header="Success!" content="Vote cast successfully!" style={{ marginTop: '10px' }} />
                )}
              </Form>
            )}
          </Card.Content>
        </Card>
      );
    }
    return choices;
  };

  // Show loading
  if (loading) {
    return <LoadingPage message="Loading Voting Details..." />;
  }

  // Show error if there's an error
  if (error) {
    return (
      <Layout>
        <Container style={{ padding: '20px 0' }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#fff5f5', 
            borderRadius: '10px',
            border: '2px dashed #e53e3e'
          }}>
            <Icon name="exclamation triangle" size="big" color="red" />
            <Header as="h3" style={{ color: '#e53e3e', marginTop: '15px' }}>
              Error Loading Voting
            </Header>
            <p style={{ color: '#e53e3e' }}>
              {error}
            </p>
          </div>
        </Container>
      </Layout>
    );
  }

  const currentTime = new Date().getTime();
  const endTime = parseInt(votingData.endDate.timestamp) * 1000;
  const isActive = !votingData.completed && currentTime <= endTime;
  
  return (
    <Layout>
      <Container style={{ padding: '20px 0' }}>
        {/* Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '20px', 
          padding: '40px', 
          marginBottom: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <Header as="h1" style={{ color: 'white', marginBottom: '15px', fontSize: '2.2em' }}>
            <Icon name="vote" />
            {votingData.title}
          </Header>
          <Label 
            size="large"
            style={{ 
              backgroundColor: votingData.completed ? '#e74c3c' : isActive ? '#27ae60' : '#f39c12',
              color: 'white',
              borderRadius: '20px',
              padding: '8px 16px',
              marginLeft: '60px'
            }}
          >
            {votingData.completed ? 'Completed' : isActive ? 'Active' : 'Ended'}
          </Label>
        </div>

        <Grid stackable>
          <Grid.Row>
            {/* Main Voting Area */}
            <Grid.Column width={votingData.isManager ? 10 : 16}>
              <Segment style={{ padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Header as="h2" style={{ color: '#2c3e50', marginBottom: '25px' }}>
                  <Icon name="list" color="blue" />
                  Voting Choices
                </Header>
                
                {/* Voting Statistics */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '20px', 
                  marginBottom: '30px',
                  padding: '20px',
                  backgroundColor: '#f8f9fb',
                  borderRadius: '10px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <Icon name="users" size="large" color="blue" />
                    <div style={{ marginTop: '5px', fontWeight: 'bold' }}>Total Votes</div>
                    <div style={{ fontSize: '1.2em', color: '#667eea' }}>{getTotalVotes()}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Icon name="list" size="large" color="green" />
                    <div style={{ marginTop: '5px', fontWeight: 'bold' }}>Choices</div>
                    <div style={{ fontSize: '1.2em', color: '#27ae60' }}>{votingData.totalChoices}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Icon name="calendar check" size="large" color="orange" />
                    <div style={{ marginTop: '5px', fontWeight: 'bold' }}>End Date</div>
                    <div style={{ fontSize: '1em', color: '#f39c12' }}>{votingData.endDate.date}</div>
                  </div>
                </div>

                {renderChoices()}
              </Segment>
            </Grid.Column>

            {/* Manager Panel (only visible to voting creator) */}
            {votingData.isManager && (
              <Grid.Column width={6}>
                <Segment style={{ padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <Header as="h3" style={{ color: '#2c3e50', marginBottom: '20px' }}>
                    <Icon name="settings" color="purple" />
                    Manager Panel
                  </Header>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <AddAllowedVotersForm address={votingData.address} />
                  </div>
                  
                  <div>
                    <CompletedVoteForm address={votingData.address} />
                  </div>
                </Segment>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </Container>
    </Layout>
  );
};

// Helper function to get initial props for Next.js routing
VotingShow.getInitialProps = async ({ query }) => {
  return { address: query.address };
};

export default withLoading(VotingShow);
