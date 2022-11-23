CREATE TABLE [dbo].[ReconcilationAddon] (
  [ID] [int] IDENTITY,
  [ReconcilationID] [int] NOT NULL,
  [SaveDate] [datetime] NOT NULL CONSTRAINT [DF_ReconcilationAddOn_Date] DEFAULT (getdate()),
  [Status] [varchar](50) NOT NULL,
  [UserID] [int] NOT NULL,
  [JEID] [int] NOT NULL
)
GO

ALTER TABLE [dbo].[ReconcilationAddon]
  ADD CONSTRAINT [FK_ReconcilationAddOn_JEID] FOREIGN KEY ([JEID]) REFERENCES [dbo].[JournalEntry] ([JournalEntryId])
GO

ALTER TABLE [dbo].[ReconcilationAddon]
  ADD CONSTRAINT [FK_ReconcilationAddOn_ReconcilationID] FOREIGN KEY ([ReconcilationID]) REFERENCES [dbo].[BankReconcilation] ([ReconcilationID])
GO