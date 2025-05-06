import { onchainTable, index, relations } from "ponder";

export const cohortBuilder = onchainTable(
  "cohort_builder",
  (t) => ({
    id: t.text().primaryKey(),
    address: t.hex().notNull(),
    amount: t.real().notNull(),
    cohortContractAddress: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    ens: t.text(),
  }),
  (table) => ({
    cohortAddressIdx: index().on(table.cohortContractAddress),
  })
);

export const cohortWithdrawal = onchainTable(
  "cohort_withdrawal",
  (t) => ({
    id: t.text().primaryKey(),
    builder: t.hex().notNull(),
    cohortBuilder: t.text().notNull(),
    amount: t.real().notNull(),
    cohortContractAddress: t.hex().notNull(),
    reason: t.text().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    cohortAddressIdx: index().on(table.cohortContractAddress),
  })
);

export const withdrawalsRelations = relations(cohortWithdrawal, ({ one }) => ({
  cohortBuilder: one(cohortBuilder, {
    fields: [cohortWithdrawal.cohortBuilder],
    references: [cohortBuilder.id],
  }),
}));
