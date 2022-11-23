CREATE TABLE [dbo].[JournalEntry] (
  [JournalEntryId] [int] IDENTITY,
  [TransactionNumber] [nvarchar](20) NOT NULL,
  [Source] [nvarchar](50) NOT NULL,
  [Description] [nvarchar](50) NOT NULL,
  [EntryDate] [date] NOT NULL,
  [DebitTotal] [decimal](18, 2) NOT NULL CONSTRAINT [df_JE_DebitTotal] DEFAULT (0.00),
  [CreditTotal] [decimal](18, 2) NOT NULL CONSTRAINT [df_JE_CreditTotal] DEFAULT (0.00),
  [TotalLines] [int] NULL,
  [ImbalanceAmount] [decimal](18, 2) NULL,
  [AuditStatus] [nvarchar](20) NOT NULL CONSTRAINT [df_JE_AuditStatus] DEFAULT ('Saved'),
  [PostedDate] [datetime] NULL,
  [ReferenceNumber] [nvarchar](20) NULL,
  [BatchNumber] [nvarchar](50) NOT NULL,
  [ProdId] [int] NOT NULL,
  [CreatedDate] [datetime] NULL CONSTRAINT [df_JE_CreatedDate] DEFAULT (getdate()),
  [modifiedDate] [datetime] NULL,
  [createdBy] [int] NOT NULL,
  [modifiedBy] [int] NULL,
  [ClosePeriod] [int] NOT NULL,
  [CompanyId] [int] NULL,
  [SourceTable] [varchar](50) NULL,
  [DocumentNo] [varchar](100) NOT NULL,
  [CurrentStatus] [varchar](50) NULL,
  [InvoiceIDPayment] [int] NULL,
  CONSTRAINT [PK_JournalEntry] PRIMARY KEY CLUSTERED ([JournalEntryId])
)
GO

ALTER TABLE [dbo].[JournalEntry]
  ADD CONSTRAINT [FK_JournalEntry_] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Company] ([CompanyID])
GO

ALTER TABLE [dbo].[JournalEntry]
  ADD CONSTRAINT [FK_JournalEntry_ClosePeriod] FOREIGN KEY ([ClosePeriod]) REFERENCES [dbo].[ClosePeriod] ([ClosePeriodId])
GO