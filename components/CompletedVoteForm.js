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
      await voting.methods.completedVoteThenTransfer().send({
        from: accounts[0],
      });

      const luckyVoter = await voting.methods.luckyVoter().call();
      if (luckyVoter == "0x0000000000000000000000000000000000000000") {
        this.setState({
          errorMessageCompletedVote: "No Winner! End Date Plus 1 Day",
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
        <Message
          error
          header="Oops!"
          content={this.state.errorMessageCompletedVote}
        />
        {this.state.successMessageCompletedVote && (
          <Message
            positive
            header="Success!"
            content="Prize has been sent to Lucky Voter!"
          />
        )}
      </Form>
    );
  }
}

export default CompletedVoteForm;
