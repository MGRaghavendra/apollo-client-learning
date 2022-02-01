import { gql, NetworkStatus, useLazyQuery, useQuery } from '@apollo/client';
import './App.css';
import { Fragment, useEffect, useState } from 'react';

const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;

const GET_DOG_PHOTO = gql`
  query GetDogPhoto($breed: String!) {
    dog(breed: $breed) {
      displayImage
      breed
    }
  }
`;

function DelayedQuery() {
  const [getDogPhoto, { loading, error, data }] = useLazyQuery(GET_DOG_PHOTO);
  if (loading) return <p>Request on FLight..:)</p>;
  if (error) return <p>Something went Wrong..</p>;
  return (
    <div>
      {data && (
        <img
          src={data.dog.displayImage}
          alt={data.dog.breed}
          style={{ height: '200px', width: '300px' }}
        />
      )}
      <br />

      <button onClick={() => getDogPhoto({ variables: { breed: 'akita' } })}>
        Get Photo && Delayed Query
      </button>
    </div>
  );
}

function DogPhoto({ breed }) {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_DOG_PHOTO,
    {
      variables: {
        breed,
      },
      notifyOnNetworkStatusChange: true,
      // pollInterval: 500,
    }
  );
  if (loading || networkStatus === NetworkStatus.refetch)
    return <p>Request on Flight..:)</p>;
  if (error) return <p>SomeThing went Wrong :)</p>;
  return (
    <Fragment>
      <img
        src={data.dog.displayImage}
        alt={data.dog.breed}
        style={{ height: '200px', width: '300px' }}
      />
      <button
        onClick={() => {
          refetch({ breed });
        }}
      >
        Reftech
      </button>
    </Fragment>
  );
}

function Dogs() {
  const { loading, error, data } = useQuery(GET_DOGS, {
    //fetchPolicy: "network-only" // Doesn't check cache before making a network request
    //nextFetchPolicy: "cache-first" // Used for subsequent executions
  });
  const [selectDog, setSelectDog] = useState('');
  const handleonChange = (event) => {
    setSelectDog(event.target.value);
  };
  if (loading) return <p>loading...</p>;
  if (error) return <p>SomeThing went Wrong :)</p>;
  return (
    <div>
      {selectDog && (
        <div style={{ margin: 'auto', width: '300px' }}>
          <h4>Dog Photo</h4>
          <DogPhoto breed={selectDog} />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '900px',
          margin: 'auto',
        }}
      >
        <select value={selectDog} onChange={handleonChange}>
          {data.dogs.map((dog) => (
            <option key={dog.id} value={dog.breed}>
              {dog.breed}
            </option>
          ))}
        </select>
        <hr></hr>
        <div>
          <h1>Delayed Query...</h1>
          {selectDog && <DelayedQuery />}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>Project-2</h1>
      <Dogs />
    </div>
  );
}

export default App;
