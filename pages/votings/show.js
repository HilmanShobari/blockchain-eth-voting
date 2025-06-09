import React from 'react';
import Layout from '../../components/Layout';
import Voting from '../../ethereum/voting';
import web3 from '../../ethereum/web3';
import { Form, Radio, Message, Button, Card, Grid } from 'semantic-ui-react';
import { Router } from '../../routes';
import AddAllowedVotersForm from '../../components/AddAllowedVotersForm';
import CompletedVoteForm from '../../components/CompletedVoteForm';

class VotingShow extends React.Component {
  static async getInitialProps(props) {
    const voting = Voting(props.query.address);
    const contractDetail = await voting.methods.getStatus().call();

    let choiceVotes = [];
    const totalChoices = contractDetail[1];

    for (let i = 0; i < totalChoices; i++) {
      const votes = await voting.methods.getVotes(i).call();
      choiceVotes.push(votes);
    }

    function formatTimestamp(timestamp) {
      const date = new Date(timestamp * 1000);
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

      return `Tanggal: ${formattedDate}, ${formattedTime}`;
    }

    return {
      address: props.query.address,
      choiceVotes,
      manager: contractDetail[0],
      totalChoices: contractDetail[1],
      fromDate: formatTimestamp(contractDetail[2]),
      endDate: formatTimestamp(contractDetail[3]),
      completed: contractDetail[4],
      totalVotersVoted: contractDetail[5],
    };
  }

  state = {
    value: null,
    errorMessage: '',
    successMessage: false,
    loading: false,
  };

  onSubmitVoting = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: '',
      successMessage: false,
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(this.props.address);
      await voting.methods.vote(this.state.value).send({ from: accounts[0] });
      this.setState({ successMessage: true });
      Router.pushRoute(`/votings/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  onChoiceChange = (event, { value }) => {
    this.setState({
      value: value,
      errorMessage: '',
      successMessage: false,
      loading: false,
    });
  };

  renderChoices() {
    const choices = [];
    for (let i = 0; i < this.props.totalChoices; i++) {
      choices.push(
        <Card key={i}>
          <Card.Content>
            <Card.Header>Pilihan {i + 1}</Card.Header>
            <Card.Meta>Received votes: {this.props.choiceVotes[i]}</Card.Meta>
            <Form onSubmit={this.onSubmitVoting} error={!!this.state.errorMessage}>
              <Form.Field>
                <Radio label="Pick this choice" name="radioGroup" value={i} checked={this.state.value === i} onChange={this.onChoiceChange} />
              </Form.Field>
              {this.state.value === i && (
                <>
                  <Button floated="right" loading={this.state.loading} primary>
                    Choose!
                  </Button>
                  <Message error header="Oops!" content={this.state.errorMessage} />
                  {this.state.successMessage && <Message positive header="Success!" content="Vote Successful!!" />}
                </>
              )}
            </Form>
          </Card.Content>
        </Card>
      );
    }
    return choices;
  }

  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <h3 style={{ marginBottom: '10px' }}>Choose to Vote!</h3>
            </Grid.Column>
            <Grid.Column width={6}>
              <AddAllowedVotersForm address={this.props.address} />
            </Grid.Column>
            <Grid.Column width={10}>Voting Manager: {this.props.manager}</Grid.Column>
            <Grid.Column width={10}>Total Choices: {this.props.totalChoices}</Grid.Column>
            <Grid.Column width={10}>From Date: {this.props.fromDate}</Grid.Column>
            <Grid.Column width={10}>End Date: {this.props.endDate}</Grid.Column>
            <Grid.Column width={10}>Total Voters: {this.props.totalVotersVoted}</Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>{this.renderChoices()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default VotingShow;
