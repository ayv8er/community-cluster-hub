# Community Cluster - Claim Camp Community Name

A Next.js application that allows users to authenticate with [Para](https://www.getpara.com/) and claim their community name.

# Claim Testnet Name on Clusters

Clusters Claim Page: https://testnet.clusters.xyz/community/camp/register

# Claim Testnet Name on Custom Build

Demo App URL: 

Clusters API v1 Documentation URL: https://docs.clusters.xyz/getting-started/api

## User Flow to Claim Community Name

1. **Authentication**
   - Users connect their wallet using Para authentication or self-custodial wallets
   - Supports multiple wallet types and traditional authentication methods

2. **After Connection**
   - After successful wallet connection, wagmi's `useAccount` hook accesses `address` to get wallet address
   - Request made to [Cluster API v1 `Get name`](https://docs.clusters.xyz/getting-started/api/v1/address-cluster-name#get-name) endpoint to check and fetch the Cluster Name of the connected wallet, if any

3. **Claim Community Name**
   - Enter a name in the modal input to check if name is available
   - Request made to [Cluster API v1 `Communities - Check availability`](https://docs.clusters.xyz/getting-started/api/v1/registration/communities#check-availability) endpoint to check if the name is available
   - If available, submit name and server request handles registration of Community Name via [Cluster API v1 `Register a community name`](https://docs.clusters.xyz/getting-started/api/v1/registration/communities#register-a-community-name)

4. **Post Community Name Claim**
   - If already a Community member, or successfully claimed a name, user can view their Community Cluster by clicking on their Community Name.
   - The Community of Cluster Names can be viewed by clicking on the title "Camp Community Hub"

## API Integration

### Pre-req

1. **Register a Community Cluster**
    - Register via GUI on [Sepolia](https://testnet.clusters.xyz/register) or [Mainnet](https://clusters.xyz/register)
    - Register via [API v1](https://docs.clusters.xyz/getting-started/api/v1/registration)

2. **Get Authentication Key with Verified Wallet**
    - Only the verified wallet of the Community Cluster (usually the wallet who registered it) can register new names
    - Get authentication key to use when registering wallets in your custom name claim flow
    - [Authentication API spec](https://docs.clusters.xyz/getting-started/api/v1/authentication)
    - Use `useAuthKey` hook to get `authKey` of connected wallet

### Clusters API Endpoints Used

1. **Get Signing Message**
- [Get Signing Message API spec](https://docs.clusters.xyz/getting-started/api/v1/authentication)
- Get signing message and corresponding date to authenticate wallet
```bash
curl -X GET https://api.clusters.xyz/v1/auth/message
```

2. **Get Authentication Key**
- [Get Authentication Key API spec](https://docs.clusters.xyz/getting-started/api/v1/authentication)
- Authenticate the ownership of a specific wallet by signing the message provided by the endpoint above.
```bash
curl -X POST https://api.clusters.xyz/v1/auth/token
  -H 'Content-Type: application/json' 
  -H 'X-API-Key: `${process.env.NEXT_PUBLIC_CLUSTERS_API_KEY}`' \
  -d '{
    'signature': 'string' # hash of signed message
    'signingDate': 'string' # corresponding date from endpoint above
    'type': 'evm'
    'wallet': 'string' # wallet that signed the message
  }'
```

3. **Fetch Community Name of Connected Wallet**
- [Get Name API spec](https://docs.clusters.xyz/getting-started/api/v1/address-cluster-name#get-name)
```bash
curl -X GET https://api.clusters.xyz/v1/names/address/${walletAddress}?testnet=true
```

4. **Check Availability of Community Name**
- [Check Community Names Availability API spec](https://docs.clusters.xyz/getting-started/api/v1/registration/communities#check-availability)
```bash
curl -X GET https://api.clusters.xyz/v1/names/community/camp/check/${nameToClaim}?testnet=true
```

5. **Claim Community Name**
- [Register Community Name API spec](https://docs.clusters.xyz/getting-started/api/v1/registration/communities#register-a-community-name)
- Set and use the authentication key generated by the verified wallet (owner of the Community Cluster) from pre-req #2 (through endpoints #1 and #2), and set it to `NEXT_PUBLIC_CAMP_CLUSTER_COMMUNITY_AUTH_KEY`

```bash
# API route: /api/cluster/register_community_name/route.ts

curl -X POST https://api.clusters.xyz/v1/names/community/camp/register?testnet=true
  -H 'Content-Type: application/json' 
  -H 'X-API-Key: `${process.env.NEXT_PUBLIC_CLUSTERS_API_KEY}`'
  -H 'Authorization: `Bearer ${process.env.NEXT_PUBLIC_CAMP_CLUSTER_COMMUNITY_AUTH_KEY}`' \
  -d '{
    'clusterName': 'string'
    'owner': 'string'
  }'
```

## Environment Variables

Required environment variables:
```bash
NEXT_PUBLIC_CLUSTERS_API_KEY= # Clusters API Key
NEXT_PUBLIC_PARA_API_KEY= # Para API Key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID= # WalletConnect Project ID
NEXT_PUBLIC_CAMP_COMMUNITY_CLUSTER_AUTH_KEY= # Authentication Key of wallet that owns the community cluster
NEXT_PUBLIC_SEPOLIA_RPC_URL=
NEXT_PUBLIC_BASECAMP_RPC_URL=
```

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the required environment variables

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- React v18.2.0
- React DOM v18.2.0
- Next.js v15.2.4
- Tailwind CSS (via @tailwindcss/postcss v4.1.3)
- TypeScript v5
- @tanstack/react-query v5.74.4
- wagmi v2.14.16
- viem (used via wagmi/chains)
- @getpara/react-sdk v1.11.0
- @getpara/wagmi-v2-integration v1.11.0
- @getpara/web-sdk v1.8.0
- Clusters API v1
- ESLint v9

## Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
│       └── cluster/
│           └── register_community_name/
│               └── route.ts
├── components/
│   ├── ClaimModal.tsx
│   ├── ClaimModalButton.tsx
│   ├── ClaimModalInput.tsx
│   └── UserInfo.tsx
├── hooks/
│   ├── useAuthKey.ts
│   └── useDebounce.ts
├── para.ts
└── Provider.tsx
```