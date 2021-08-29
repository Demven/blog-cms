import { env } from '../env';

const GQL_URL = `${env.API_HOST}/graphql`;

export function gqlQuery (query) {
  return fetch(GQL_URL, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: `{ ${query} }` }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get GQL response');
    })
    .then(({ data, errors }) => {
      const errorMessage = (errors && errors[0]?.message) || '';

      return {
        ...data,
        errorMessage,
      };
    })
    .catch(console.error);
}

export function gqlMutation (mutation) {
  return fetch(GQL_URL, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: ` mutation { ${mutation} }`,
    }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get GQL response');
    })
    .then(({ data, errors }) => {
      const errorMessage = (errors && errors[0]?.message) || '';

      return {
        ...data,
        errorMessage,
      };
    })
    .catch(console.error);
}

export function serializeGQLObject (object) {
  return JSON.stringify(object)
    .replace(/"(\w+)":/ig, '$1:');
}
