import React, { useState } from "react";
import { Form, Message, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Voting from "../ethereum/voting";
import { useRouter } from "next/router";

const CompletedVoteForm = ({ address }) => {
  const router = useRouter();
  const [loadingCompletedVote, setLoadingCompletedVote] = useState(false);
  const [errorMessageCompletedVote, setErrorMessageCompletedVote] = useState("");
  const [successMessageCompletedVote, setSuccessMessageCompletedVote] = useState(false);

  const completedVote = async (event) => {
    event.preventDefault();
    setLoadingCompletedVote(true);
    setErrorMessageCompletedVote("");
    setSuccessMessageCompletedVote(false);

    try {
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(address);
      await voting.methods.complete().send({
        from: accounts[0],
      });

      const completed = await voting.methods.completed().call();
      if (!completed) {
        setErrorMessageCompletedVote("Voting completion failed");
        setLoadingCompletedVote(false);
      } else {
        setSuccessMessageCompletedVote(true);
        setLoadingCompletedVote(false);
      }
      router.push(`/votings/${address}`);
    } catch (err) {
      setErrorMessageCompletedVote(err.message);
      setSuccessMessageCompletedVote(false);
      setLoadingCompletedVote(false);
    }
  };

  return (
    <Form
      onSubmit={completedVote}
      error={!!errorMessageCompletedVote}
    >
      <Button loading={loadingCompletedVote} primary>
        Complete Vote
      </Button>
      <Message
        error
        header="Oops!"
        content={errorMessageCompletedVote}
      />
      {successMessageCompletedVote && (
        <Message
          positive
          header="Success!"
          content="Vote completed successfully!"
        />
      )}
    </Form>
  );
};

export default CompletedVoteForm;
