import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
  Variables,
} from 'relay-runtime';

const fetchGraphQL = async (
  text: string | null | undefined,
  variables: Variables,
): Promise<any> => {
  const REACT_APP_GITHUB_AUTH_TOKEN = process.env.REACT_APP_GITHUB_AUTH_TOKEN;

  // Fetch data from GitHub's GraphQL API:
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${REACT_APP_GITHUB_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  // Get the response as JSON
  return await response.json();
};

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
const fetchRelay: FetchFunction = async (params, variables) => {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`,
  );
  return fetchGraphQL(params.text, variables);
};

// Export a singleton instance of Relay Environment configured with our network function:
const environment = new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});

export default environment;
