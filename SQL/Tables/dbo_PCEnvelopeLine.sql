CREATE TABLE [dbo].[PCEnvelopeLine] (
  [EnvelopeLineID] [int] IDENTITY,
  [PCEnvelopeID] [int] NOT NULL,
  [TransactionLineNumber] [int] NOT NULL,
  [COAID] [int] NOT NULL,
  [Amount] [decimal](18, 2) NOT NULL CONSTRAINT [PCL_DF_Amount] DEFAULT (0.00),
  [VendorID] [int] NULL,
  [LineDescription] [nvarchar](100) NOT NULL,
  [TransactionCodeString] [nvarchar](100) NOT NULL,
  [Setid] [int] NULL,
  [SeriesID] [int] NULL,
  [Prodid] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL CONSTRAINT [PCL_DF_CreatedDate] DEFAULT (getdate()),
  [Modifieddate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  [CoaString] [nvarchar](100) NOT NULL,
  [TaxCode] [nvarchar](10) NULL,
  [Displayflag] [nvarchar](20) NULL,
  CONSTRAINT [PK_PCEnvelopeLine] PRIMARY KEY CLUSTERED ([EnvelopeLineID])
)
GO

ALTER TABLE [dbo].[PCEnvelopeLine]
  ADD CONSTRAINT [FK_PCEnvelopeLine_COAID] FOREIGN KEY ([COAID]) REFERENCES [dbo].[COA] ([COAID])
GO

ALTER TABLE [dbo].[PCEnvelopeLine]
  ADD CONSTRAINT [FK_PCEnvelopeLine_PCEnvelopeID] FOREIGN KEY ([PCEnvelopeID]) REFERENCES [dbo].[PCEnvelope] ([PcEnvelopeID])
GO

ALTER TABLE [dbo].[PCEnvelopeLine]
  ADD CONSTRAINT [FK_PCEnvelopeLine_VendorID] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[tblVendor] ([VendorID])
GO