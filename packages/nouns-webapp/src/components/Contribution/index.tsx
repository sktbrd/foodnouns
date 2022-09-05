import classes from './Contribution.module.css';
import Section from '../../layout/Section';
import { useQuery } from '@apollo/client';
import { totalBid } from '../../wrappers/subgraph';
import { ethers } from 'ethers';

const Contribution = () => {
  const { loading, error, data } = useQuery(totalBid());

  if (loading) {
    return (
      <div>
        <b>loading...</b>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <b>error...</b>
      </div>
    );
  }

  return (
    <Section fullWidth={false} className={classes.wrapper}>
      <div style={{ textAlign: 'center' }}>
        <h1>Total Contribution to NounsDAO:</h1>
        <h1>
          <u>
            Ξ {parseFloat(ethers.utils.formatEther(data.governances[0].totalBid.toString())) * 0.25}
          </u>
        </h1>
        <h2>
          FOODNOUNS DAO automatically and trustlessly sends 25% of all auction proceeds to NounsDAO
          treasury contract....forever. We are honored to be a premier subDAO and member of the
          larger nounish ecosystem.
        </h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}></div>
    </Section>
  );
};
export default Contribution;
