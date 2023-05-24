export const queriesAccount = {
  view: `select acc.*, sum(opv.debit) as debit, sum(opv.credit) as credit, sum(opv.debit) - sum(opv.credit) 
  as rbalance from account acc left outer 
  join operation_view opv on opv.path like acc.path || '%' and opv.time >= ? and opv.time <= ?  where acc.id = ?  group by acc.id;`,
};
