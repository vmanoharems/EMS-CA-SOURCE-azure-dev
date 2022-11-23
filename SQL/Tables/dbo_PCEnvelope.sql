CREATE TABLE [dbo].[PCEnvelope] (
  [PcEnvelopeID] [int] IDENTITY,
  [Companyid] [int] NOT NULL,
  [BatchNumber] [nvarchar](20) NOT NULL,
  [CustodianId] [int] NOT NULL,
  [RecipientId] [int] NOT NULL,
  [EnvelopeNumber] [nvarchar](20) NOT NULL,
  [Description] [nvarchar](100) NOT NULL,
  [AdvanceAmount] [decimal](18, 2) NOT NULL CONSTRAINT [DF_AdvanceAmount] DEFAULT (0.00),
  [EnvelopeAmount] [decimal](18, 2) NOT NULL CONSTRAINT [DF_EnvelopeAmount] DEFAULT (0.00),
  [LineItemAmount] [decimal](18, 2) NOT NULL CONSTRAINT [DF_LineItemAmount] DEFAULT (0.00),
  [Difference] [decimal](18, 2) NOT NULL CONSTRAINT [DF_Difference] DEFAULT (0.00),
  [PostedDate] [datetime] NULL,
  [Status] [nvarchar](10) NOT NULL,
  [CreatedDate] [datetime] NOT NULL CONSTRAINT [PCE_DF_CreatedDate] DEFAULT (getdate()),
  [Modifieddate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  [Prodid] [int] NOT NULL,
  [PostedBy] [int] NULL,
  [ClosePeriodId] [int] NOT NULL,
  [MirrorStatus] [varchar](10) NULL,
  CONSTRAINT [PK_PCEnvelope] PRIMARY KEY CLUSTERED ([PcEnvelopeID])
)
GO

ALTER TABLE [dbo].[PCEnvelope]
  ADD CONSTRAINT [FK_PCEnvelope_CustodianID] FOREIGN KEY ([CustodianId]) REFERENCES [dbo].[Custodian] ([CustodianID])
GO

ALTER TABLE [dbo].[PCEnvelope]
  ADD CONSTRAINT [FK_PCEnvelope_RecipientId] FOREIGN KEY ([RecipientId]) REFERENCES [dbo].[Recipient] ([RecipientID])
GO