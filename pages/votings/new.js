import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

class VotingNew extends Component {
  state = {
    numberOfChoice: '',
    endDate: '',
    errorMessage: '',
    successMessage: false,
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '', successMessage: false });

    try {
      const startDateTimestamp = Math.floor(new Date().getTime() / 1000);
      const endDateTimestamp = Math.floor(this.state.endDate / 1000);

      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      await factory.methods.createVoting(this.state.numberOfChoice, startDateTimestamp, endDateTimestamp).send({
        from: accounts[0],
      });

      // this.setState({ successMessage: true });
      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  handleEndDateChange(date) {
    const selectedDate = date;
    const currentDate = new Date();

    if (new Date(selectedDate) < currentDate) {
      alert('You cannot select a date before today');
      return;
    }
    this.setState({ endDate: selectedDate });
  }

  render() {
    return (
      <Layout>
        <h1>Create A Voting</h1>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Number Of Choice</label>
            <Input label="number" labelPosition="right" value={this.state.numberOfChoice} onChange={(event) => this.setState({ numberOfChoice: event.target.value })} />

            <label>End Date of Voting</label>
            <DatePicker value={this.state.endDate} selected={this.state.endDate} onChange={(event) => this.handleEndDateChange(event)} showTimeSelect dateFormat="Pp" />
          </Form.Field>

          <Button loading={this.state.loading} primary>
            Create
          </Button>

          <Message error header="Oops!" content={this.state.errorMessage} />
          {this.state.successMessage && <Message positive header="Success!" content="Voting Created!" />}
        </Form>
      </Layout>
    );
  }
}

export default VotingNew;
