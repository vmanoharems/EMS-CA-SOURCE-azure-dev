CREATE TABLE [dbo].[BankReconcilation] (
  [ReconcilationID] [int] NOT NULL,
  [BankID] [int] NOT NULL,
  [Status] [varchar](50) NOT NULL,
  [OpenDate] [datetime] NOT NULL CONSTRAINT [DF_BankReconcilation_OpenDate] DEFAULT (getdate()),
  [OpenBy] [int] NOT NULL,
  [CompleteDatet] [datetime] NULL,
  [CompleteBy] [int] NULL,
  [ProdID] [int] NOT NULL,
  [StatementDate] [date] NOT NULL,
  [StatementEndingAmount] [decimal](18, 2) NOT NULL,
  [DisplayAll] [bit] NOT NULL CONSTRAINT [DF_BankReconcilation_DisplayAll] DEFAULT (1),
  [MarkVoided] [bit] NOT NULL CONSTRAINT [DF_BankReconcilation_MarkVoided] DEFAULT (1),
  [CurrentUserID] [int] NOT NULL,
  CONSTRAINT [PK_BankReconcilation] PRIMARY KEY CLUSTERED ([ReconcilationID])
)
GO

ALTER TABLE [dbo].[BankReconcilation]
  ADD CONSTRAINT [FK_BankReconciliation_BankID] FOREIGN KEY ([BankID]) REFERENCES [dbo].[BankInfo] ([BankId])
GO