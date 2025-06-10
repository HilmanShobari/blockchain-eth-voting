import React, { useState } from "react";
import { Form, Message, Button, Input } from "semantic-ui-react";
import web3 from "../ethereum/web3";
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
      const accounts = await web3.eth.getAccounts();
      const voting = Voting(address);

      await voting.methods.addVoter(value).send({
        from: accounts[0],
      });

      setSuccessMessage(true);
      setLoading(false);
      setValue("");
      router.push(`/votings/${address}`);
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
