import { onchainTable, index, relations, onchainEnum } from "ponder";

export const cohortBuilder = onchainTable("cohort_builder", (t) => ({
  address: t.hex().primaryKey(),
  amount: t.real().notNull(),
  timestamp: t.bigint().notNull(),
  ens: t.text(),
}));

export const cohortWithdrawal = onchainTable("cohort_withdrawal", (t) => ({
  id: t.text().primaryKey(),
  builder: t.hex().notNull(),
  amount: t.real().notNull(),
  reason: t.text().notNull(),
  timestamp: t.bigint().notNull(),
  projectName: t.text().notNull(),
}));

export const withdrawalsRelations = relations(cohortWithdrawal, ({ one }) => ({
  cohortBuilder: one(cohortBuilder, {
    fields: [cohortWithdrawal.builder],
    references: [cohortBuilder.address],
  }),
}));

export const withdrawalRequestStatus = onchainEnum("status", [
  "pending",
  "approved",
  "rejected",
]);

export const cohortWithdrawalRequest = onchainTable(
  "cohort_withdrawal_request",
  (t) => ({
    id: t.text().primaryKey(),
    requestId: t.bigint().notNull(),
    builder: t.hex().notNull(),
    amount: t.real().notNull(),
    reason: t.text().notNull(),
    timestamp: t.bigint().notNull(),
    projectName: t.text().notNull(),
    status: withdrawalRequestStatus("status").notNull(),
  }),
  (table) => ({
    statusIdx: index().on(table.status),
  })
);

export const withdrawalRequestsRelations = relations(
  cohortWithdrawalRequest,
  ({ one }) => ({
    cohortBuilder: one(cohortBuilder, {
      fields: [cohortWithdrawalRequest.builder],
      references: [cohortBuilder.address],
    }),
  })
);
