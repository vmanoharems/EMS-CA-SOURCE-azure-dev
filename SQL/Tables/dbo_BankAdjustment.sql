CREATE TABLE [dbo].[BankAdjustment] (
  [AdjustmentID] [int] IDENTITY,
  [BankID] [int] NOT NULL,
  [ProdID] [int] NOT NULL,
  [ReconcilationID] [int] NOT NULL,
  [AdjustmentNumber] [int] NOT NULL,
  [Date] [datetime] NOT NULL CONSTRAINT [DF_BankAdjustment_Date] DEFAULT (getdate()),
  [Amount] [decimal](18, 2) NOT NULL,
  [Description] [varchar](50) NOT NULL,
  [UserID] [int] NOT NULL,
  [Status] [varchar](50) NOT NULL
)
GO

ALTER TABLE [dbo].[BankAdjustment]
  ADD CONSTRAINT [FK_BankAdjustment_BankID] FOREIGN KEY ([BankID]) REFERENCES [dbo].[BankInfo] ([BankId])
GO

ALTER TABLE [dbo].[BankAdjustment]
  ADD CONSTRAINT [FK_BankAdjustment_ReconcilationID] FOREIGN KEY ([ReconcilationID]) REFERENCES [dbo].[BankReconcilation] ([ReconcilationID])
GO