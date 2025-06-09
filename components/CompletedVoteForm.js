import React from "react";
import { Form, Message, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Voting from "../ethereum/voting";
import { Router } from "../routes";

class CompletedVoteForm extends React.Component {
  state = {
    value: "",
    errorMessage: "",
    successMessage: false,
    loading: false
  };

  completedVote = async (event) => {
    event.preventDefault();
    this.setState({
      loadingCompletedVote: true,
      errorMessageCompletedVote: "",
      successMessageCompletedVote: false,
    });
    try {
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(this.props.address);
      await voting.methods.complete().send({
        from: accounts[0],
      });

      const completed = await voting.methods.completed().call();
      if (!completed) {
        this.setState({
          errorMessageCompletedVote: "Voting completion failed",
          loadingCompletedVote: false,
        });
      } else {
        this.setState({
          successMessageCompletedVote: true,
          loadingCompletedVote: false
        });
      }
      Router.pushRoute(`/votings/${this.props.address}`);
    } catch (err) {
      this.setState({
        errorMessageCompletedVote: err.message,
        successMessageCompletedVote: false,
        loadingCompletedVote: false,
      });
    }
  };

  render() {
    return (
      <Form
        onSubmit={this.completedVote}
        error={!!this.state.errorMessageCompletedVote}
      >
        <Button loading={this.state.loadingCompletedVote} primary>
          Complete Vote
        </Button>
        <Message
          error
          header="Oops!"
          content={this.state.errorMessageCompletedVote}
        />
        {this.state.successMessageCompletedVote && (
          <Message
            positive
            header="Success!"
            content="Vote completed successfully!"
          />
        )}
      </Form>
    );
  }
}

export default CompletedVoteForm;
