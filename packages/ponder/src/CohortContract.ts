import { ponder } from "ponder:registry";
import { formatUnits, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import {
  cohortBuilder,
  cohortWithdrawal,
  cohortWithdrawalRequest,
} from "ponder:schema";

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
      address: event.args.to,
      amount: parseFloat(formatUnits(event.args.amount, 6)),
      timestamp: event.block.timestamp,
      ens: ensName,
    })
    .onConflictDoUpdate(() => ({
      amount: parseFloat(formatUnits(event.args.amount, 6)),
      timestamp: event.block.timestamp,
    }));
});

ponder.on("Cohort:UpdateBuilder", async ({ event, context }) => {
  await context.db.update(cohortBuilder, { address: event.args.to }).set({
    amount: parseFloat(formatUnits(event.args.amount, 6)),
  });
});

ponder.on("Cohort:Withdraw", async ({ event, context }) => {
  await context.db.insert(cohortWithdrawal).values({
    id: event.log.id,
    builder: event.args.to,
    amount: parseFloat(formatUnits(event.args.amount, 6)),
    reason: event.args.reason,
    timestamp: event.block.timestamp,
    projectName: event.args.projectName,
  });
});

ponder.on("Cohort:WithdrawRequested", async ({ event, context }) => {
  await context.db.insert(cohortWithdrawalRequest).values({
    id: `${event.args.builder}-${event.args.requestId}`,
    requestId: event.args.requestId,
    builder: event.args.builder,
    amount: parseFloat(formatUnits(event.args.amount, 6)),
    reason: event.args.reason,
    timestamp: event.block.timestamp,
    projectName: event.args.projectName,
    status: "pending",
  });
});

ponder.on("Cohort:WithdrawApproved", async ({ event, context }) => {
  await context.db
    .update(cohortWithdrawalRequest, {
      id: `${event.args.builder}-${event.args.requestId}`,
    })
    .set({
      status: "approved",
    });
});

ponder.on("Cohort:WithdrawRejected", async ({ event, context }) => {
  await context.db
    .update(cohortWithdrawalRequest, {
      id: `${event.args.builder}-${event.args.requestId}`,
    })
    .set({
      status: "rejected",
    });
});
