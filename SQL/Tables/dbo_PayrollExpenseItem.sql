CREATE TABLE [dbo].[PayrollExpenseItem] (
  [PayrollExpenseItemID] [int] IDENTITY,
  [TransactionCodeID] [int] NULL,
  [TransactionValueID] [int] NULL,
  [PayrollExpenseID] [int] NULL,
  [CreatedDate] [datetime] NULL,
  [ModifiedDate] [datetime] NULL,
  [Createdby] [int] NULL,
  [Modifiedby] [int] NULL
)
GO