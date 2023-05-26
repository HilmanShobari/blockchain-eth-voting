import React from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";

class VotingIndex extends React.Component {
  static async getInitialProps() {
    const votings = await factory.methods.getDeployedVotings().call();

    return { votings };
  }

  renderCampaigns() {
    const items = this.props.votings.map((address) => {
      return {
        header: address,
        description: <Link route={`/votings/${address}`}><a>View Voting</a></Link>,
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <div>
        <Layout>
          <h3>Opened Voting</h3>
          <Link route="/votings/new">
            <a>
              <Button
                floated="right"
                content="Create Voting"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </Layout>
      </div>
    );
  }
}

export default VotingIndex;
