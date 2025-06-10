import React, { useState } from "react";
import { Form, Message, Button } from "semantic-ui-react";
import provider from "../ethereum/ethers";
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
      const signer = await provider.getSigner();
      const voting = Voting(address);
      const votingWithSigner = voting.connect(signer);
      console.log('Completing vote...');
      const transaction = await votingWithSigner.complete();
      console.log('Transaction sent:', transaction.hash);
      
      console.log('Waiting for confirmation...');
      await transaction.wait();
      console.log('Transaction confirmed');

      const completed = await voting.completed();
      if (!completed) {
        setErrorMessageCompletedVote("Voting completion failed");
        setLoadingCompletedVote(false);
      } else {
        setSuccessMessageCompletedVote(true);
        setLoadingCompletedVote(false);
      }
      
      // Refresh page after successful transaction
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
