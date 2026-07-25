// server/src/anchor.mjs
// BSC Testnet audit-anchor client. Runs in "simulated" mode unless
// AIXIN_ANCHOR_RPC_URL, AIXIN_ANCHOR_CONTRACT, and AIXIN_ANCHOR_PRIVATE_KEY
// are all set.
import { createPublicClient, createWalletClient, http, keccak256, toHex } from 'viem';
import { bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const ABI = [
  {
    type: 'function',
    name: 'anchor',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sipId', type: 'bytes32' },
      { name: 'payloadHash', type: 'bytes32' },
    ],
    outputs: [],
  },
];

function envConfig() {
  const rpc = process.env.AIXIN_ANCHOR_RPC_URL;
  const contract = process.env.AIXIN_ANCHOR_CONTRACT;
  const pk = process.env.AIXIN_ANCHOR_PRIVATE_KEY;
  return { rpc, contract, pk };
}

export function anchorStatus() {
  const { rpc, contract, pk } = envConfig();
  const configured = Boolean(rpc && contract && pk);
  return {
    mode: configured ? 'live' : 'simulated',
    chain: 'bsc-testnet',
    chainId: bscTestnet.id,
    contract: contract ?? null,
    rpc: rpc ?? null,
  };
}

function toBytes32(input) {
  return keccak256(toHex(input));
}

export async function anchorHash(payloadHash, sipId = 'aixin-receipt') {
  const { rpc, contract, pk } = envConfig();
  if (!rpc || !contract || !pk) {
    const fake = keccak256(toHex(`${sipId}:${payloadHash}:${Date.now()}`));
    return { status: 'simulated', txHash: fake, chainId: bscTestnet.id };
  }
  try {
    const account = privateKeyToAccount(pk.startsWith('0x') ? pk : `0x${pk}`);
    const wallet = createWalletClient({ account, chain: bscTestnet, transport: http(rpc) });
    const publicClient = createPublicClient({ chain: bscTestnet, transport: http(rpc) });
    const txHash = await wallet.writeContract({
      address: contract,
      abi: ABI,
      functionName: 'anchor',
      args: [toBytes32(sipId), toBytes32(payloadHash)],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, timeout: 30_000 });
    return {
      status: 'anchored',
      txHash,
      chainId: bscTestnet.id,
      blockNumber: Number(receipt.blockNumber),
    };
  } catch (err) {
    const fake = keccak256(toHex(`${sipId}:${payloadHash}:${Date.now()}`));
    return {
      status: 'failed',
      txHash: fake,
      chainId: bscTestnet.id,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}
