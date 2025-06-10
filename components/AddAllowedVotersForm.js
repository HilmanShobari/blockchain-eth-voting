import React, { useState } from "react";
import { Form, Message, Button, Input } from "semantic-ui-react";
import provider from "../ethereum/ethers";
import Voting from "../ethereum/voting";
import { useRouter } from "next/router";

const AddAllowedVotersForm = ({ address }) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage(false);

    try {
      const signer = await provider.getSigner();
      const voting = Voting(address);
      const votingWithSigner = voting.connect(signer);

      console.log('Adding voter...');
      const transaction = await votingWithSigner.addVoter(value);
      console.log('Transaction sent:', transaction.hash);
      
      console.log('Waiting for confirmation...');
      await transaction.wait();
      console.log('Transaction confirmed');

      setSuccessMessage(true);
      setLoading(false);
      setValue("");
      
      // Refresh page after successful transaction
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message);
      setSuccessMessage(false);
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Address of Allowed Voters</label>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </Form.Field>

      <Button loading={loading} primary>
        Add Voter!
      </Button>

      <Message error header="Oops!" content={errorMessage} />
      {successMessage && (
        <Message
          positive
          header="Success!"
          content="Address Added Successfully"
        />
      )}
    </Form>
  );
};

export default AddAllowedVotersForm;
