CREATE TABLE [dbo].[JournalEntryDetail] (
  [JournalEntryDetailId] [int] IDENTITY,
  [JournalEntryId] [int] NOT NULL,
  [TransactionLineNumber] [nvarchar](20) NULL,
  [COAId] [int] NOT NULL,
  [DebitAmount] [decimal](18, 2) NOT NULL CONSTRAINT [df_JED_DebitAmount] DEFAULT (0.00),
  [CreditAmount] [decimal](18, 2) NOT NULL CONSTRAINT [df_JED_CreditAmount] DEFAULT (0.00),
  [VendorId] [int] NULL,
  [VendorName] [nvarchar](50) NULL,
  [ThirdParty] [bit] NOT NULL CONSTRAINT [df_JED_ThirdParty] DEFAULT (0),
  [Note] [nvarchar](200) NOT NULL CONSTRAINT [df_JED_Note] DEFAULT (''),
  [CompanyId] [int] NOT NULL,
  [ProdId] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL CONSTRAINT [df_JED_CreatedDate] DEFAULT (getdate()),
  [CreatedBy] [int] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [COAString] [nvarchar](400) NOT NULL,
  [TransactionCodeString] [nvarchar](400) NULL,
  [SetId] [int] NULL,
  [SeriesId] [int] NULL,
  [TaxCode] [nvarchar](50) NULL,
  CONSTRAINT [PK_JournalEntryDetail] PRIMARY KEY CLUSTERED ([JournalEntryDetailId])
)
GO

CREATE INDEX [IX_COAID]
  ON [dbo].[JournalEntryDetail] ([COAId])
GO

CREATE INDEX [IX_VendorID]
  ON [dbo].[JournalEntryDetail] ([VendorId])
GO

ALTER TABLE [dbo].[JournalEntryDetail]
  ADD CONSTRAINT [FK_JournalEntry_JournalEntryId] FOREIGN KEY ([JournalEntryId]) REFERENCES [dbo].[JournalEntry] ([JournalEntryId])
GO

ALTER TABLE [dbo].[JournalEntryDetail]
  ADD CONSTRAINT [FK_JournalEntryDetail_COAId] FOREIGN KEY ([COAId]) REFERENCES [dbo].[COA] ([COAID])
GO

ALTER TABLE [dbo].[JournalEntryDetail]
  ADD CONSTRAINT [FK_JournalEntryDetail_CompanyID] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Company] ([CompanyID])
GO

ALTER TABLE [dbo].[JournalEntryDetail]
  ADD CONSTRAINT [FK_JournalEntryDetail_VendorId] FOREIGN KEY ([VendorId]) REFERENCES [dbo].[tblVendor] ([VendorID])
GO