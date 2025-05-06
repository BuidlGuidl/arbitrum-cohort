import { ponder } from "ponder:registry";
import { formatEther, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { cohortBuilder, cohortWithdrawal } from "ponder:schema";

// Create a viem client for the mainnet
const clientMainnet = createPublicClient({
  chain: mainnet,
  transport: http(process.env.PONDER_RPC_MAINNET),
});

ponder.on("Cohort:AddBuilder", async ({ event, context }) => {
  let ensName = null;

  try {
    ensName = await clientMainnet.getEnsName({
      address: event.args.to,
    });
  } catch (e) {
    console.error("Error resolving ENS name: ", e);
  }

  await context.db
    .insert(cohortBuilder)
    .values({
      id: `${event.args.to}-${event.log.address}`,
      address: event.args.to,
      amount: parseFloat(formatEther(event.args.amount)),
      cohortContractAddress: event.log.address,
      timestamp: event.block.timestamp,
      ens: ensName,
    })
    .onConflictDoUpdate(() => ({
      amount: parseFloat(formatEther(event.args.amount)),
      timestamp: event.block.timestamp,
    }));
});

ponder.on("Cohort:UpdateBuilder", async ({ event, context }) => {
  await context.db
    .update(cohortBuilder, { id: `${event.args.to}-${event.log.address}` })
    .set({
      amount: parseFloat(formatEther(event.args.amount)),
    });
});

ponder.on("Cohort:Withdraw", async ({ event, context }) => {
  const cohortContractAddress = event.log.address;

  await context.db.insert(cohortWithdrawal).values({
    id: event.log.id,
    builder: event.args.to,
    cohortBuilder: `${event.args.to}-${cohortContractAddress}`,
    amount: parseFloat(formatEther(event.args.amount)),
    cohortContractAddress,
    reason: event.args.reason,
    timestamp: event.block.timestamp,
  });

  const balance = await context.client.getBalance({
    address: cohortContractAddress,
  });
});
