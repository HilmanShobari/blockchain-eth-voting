import React from "react";
import { Form, Message, Button, Input } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Voting from "../ethereum/voting";
import { Router } from "../routes";

class AddAllowedVotersForm extends React.Component {
  state = {
    value: "",
    errorMessage: "",
    successMessage: false,
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      loading: true,
      errorMessage: "",
      successMessage: false,
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(this.props.address);

      await voting.methods.addVoter(this.state.value).send({
        from: accounts[0],
      });

      this.setState({
        successMessage: true,
        loading: false,
        value: "",
      });
      Router.pushRoute(`/votings/${this.props.address}`);
    } catch (err) {
      this.setState({
        errorMessage: err.message,
        successMessage: false,
        loading: false,
      });
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Address of Allowed Voters</label>
          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>

        <Button loading={this.state.loading} primary>
          Add Voter!
        </Button>

        <Message error header="Oops!" content={this.state.errorMessage} />
        {this.state.successMessage && (
          <Message
            positive
            header="Success!"
            content="Address Added Successfully"
          />
        )}
      </Form>
    );
  }
}

export default AddAllowedVotersForm;
