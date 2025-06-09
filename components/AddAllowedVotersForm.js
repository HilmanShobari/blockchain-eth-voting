import React from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Voting from "../ethereum/voting";

class AddAllowedVotersForm extends React.Component {
  state = {
    value: "",
    errorMessage: "",
    successMessage: false,
    loading: false,
  };

  addAllowedVoters = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      successMessage: false,
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(this.props.address);
      await voting.methods.addAllowerdVoters(this.state.value).send({
        from: accounts[0],
      });
      this.setState({
        successMessage: true,
        loading: false,
      });
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
      <Form onSubmit={this.addAllowedVoters} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Add Allowed Address To Become Voters</label>
          <Input
            label="address"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Button loading={this.state.loading} primary>
          Add!
        </Button>

        <Message error header="Oops!" content={this.state.errorMessage} />
        {this.state.successMessage && (
          <Message
            positive
            header="Success!"
            content="Address Has Been Added!"
          />
        )}
      </Form>
    );
  }
}

export default AddAllowedVotersForm;
