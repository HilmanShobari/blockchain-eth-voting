import React from "react";
import { Form, Radio, Message, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Voting from "../ethereum/voting";

class CompletedVoteForm extends React.Component {
  state = {
    value: null,
    errorMessage: "",
    successMessage: false,
    loading: false,
  };

  onSubmitVoting = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      successMessage: false,
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(this.props.address);
      await voting.methods
        .pickChoice(this.state.value)
        .send({ from: accounts[0] });
      this.setState({ successMessage: true });
      Router.pushRoute(`/votings/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  onChoiceChange = (event, { value }) => {
    this.setState({
      value: value,
      errorMessage: "",
      successMessage: false,
      loading: false,
    });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmitVoting} error={!!this.state.errorMessage}>
        <Form.Field>
          <Radio
            label="Pick this choice"
            name="radioGroup"
            value={this.props.index}
            checked={this.state.value === this.props.index}
            onChange={this.onChoiceChange}
          />
        </Form.Field>
        {this.state.value === this.props.index && (
          <>
            <Button floated="right" loading={this.state.loading} primary>
              Choose!
            </Button>
            <Message error header="Oops!" content={this.state.errorMessage} />
            {this.state.successMessage && (
              <Message positive header="Success!" content="Vote Successful!!" />
            )}
          </>
        )}
      </Form>
    );
  }
}

export default CompletedVoteForm;
