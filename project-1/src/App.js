import { useQuery, gql } from '@apollo/client';
import React from 'react';
import './App.css';
const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;
function App() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);
  return (
    <div className="App">
      <h2>Fetching data using useQuery</h2>
      {error ? (
        <div>Error occured</div>
      ) : loading ? (
        <p>Loading....</p>
      ) : (
        <div
          style={{
            height: '300px',
            overflow: 'scroll',
            overflowX: 'hidden',
            width: '800px',
            border: '3px solid red',
            padding: '5px',
            borderRadius: '5px',
            margin: 'auto',
          }}
        >
          <pre style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {JSON.stringify(data, 2, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
