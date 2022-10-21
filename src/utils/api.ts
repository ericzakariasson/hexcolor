import { gql, GraphQLClient } from 'graphql-request';
import { stringIsHex } from '../utils/regex';
import colors from '../config/colors.json';

const ensQuery = gql`
  query GetEns($name: String) {
    domains(where: { name: $name, owner_contains: "0x" }) {
      labelName
      name
      owner {
        id
        domains {
          labelName
        }
      }
    }
  }
`;

const client = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  {
    fetch: fetch,
  }
);

export const getEns = async (color: string) => {
  const result = await client.request<any>(ensQuery, {
    name: `${color}.eth`.toLowerCase(),
  });

  const [match] = result.domains;
  if (match) {
    let ensName;
    // const provider = new ethers.providers.JsonRpcProvider(
    //   `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
    // );

    // try {
    //   ensName = await provider.lookupAddress(
    //     ethers.utils.getAddress(match.owner.id)
    //   );
    // } catch (e) {
    //   console.log('!!');
    //   console.error(e);
    // }

    return {
      available: false,
      ensName,
      owner: match.owner.id,
      alsoOwns: match.owner.domains
        .filter(
          (domain: { labelName: string }) =>
            domain.labelName.toLowerCase() !== color.toLowerCase()
        )
        .filter((domain) => stringIsHex('#' + domain.labelName))
        .map((domain) => domain.labelName),
    };
  }
  return {
    available: true,
  };
};

const holderQuery = gql`
  query GetEnsHoldings($address: String) {
    domains(where: { owner: $address }) {
      labelName
      name
    }
  }
`;

export const getUserHoldings = async (address: string): Promise<string[]> => {
  const result = await client.request<any>(holderQuery, {
    address: address.toLowerCase(),
  });

  return result.domains
    .filter((domain) => stringIsHex('#' + domain.labelName))
    .map((domain) => domain.labelName);
};

const topQuery = gql`
  query GetTop($names: [String]) {
    domains(where: { name_in: $names, owner_contains: "0x" }) {
      labelName
      name
      owner {
        id
      }
    }
  }
`;

export const getTopNames = async (): Promise<
  { hex: string; available: boolean; rgb: string; name: string }[]
> => {
  const names = colors.map((c) => c.hex + '.eth');
  const result = await client.request<any>(topQuery, {
    names,
  });

  return colors.map((color) => ({
    ...color,
    available: !result.domains.some((domain) => domain.labelName === color.hex),
  }));
};
