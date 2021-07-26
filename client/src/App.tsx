import { Suspense } from 'react';
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
  PreloadedQuery,
} from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import RelayEnvironment from './relay/RelayEnvironment';
import { AppRepositoryNameQuery } from './__generated__/AppRepositoryNameQuery.graphql';
import './App.css';

// Define a query
const RepositoryNameQuery = graphql`
  query AppRepositoryNameQuery {
    repository(owner: "facebook", name: "relay") {
      name
    }
  }
`;

// Immediately load the query as our app starts. For a real app, we'd move this
// into our routing configuration, preloading data as we transition to new routes.
const preloadedQuery = loadQuery(RelayEnvironment, RepositoryNameQuery, {
  /* query variables */
});

function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={<div>Loading...</div>}>
        <Repository preloadedQuery={preloadedQuery} />
      </Suspense>
    </RelayEnvironmentProvider>
  );
}

interface RepositoryProps {
  preloadedQuery: PreloadedQuery<any>;
}

function Repository(props: RepositoryProps) {
  const data = usePreloadedQuery<AppRepositoryNameQuery>(
    RepositoryNameQuery,
    props.preloadedQuery,
  );

  console.log(data);

  return <div>Repository Component</div>;
}

export default App;
