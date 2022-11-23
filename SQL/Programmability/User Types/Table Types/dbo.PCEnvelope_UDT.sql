CREATE TYPE [dbo].[PCEnvelope_UDT] AS TABLE (
  [PcEnvelopeID] [int] NOT NULL,
  [Companyid] [int] NOT NULL,
  [BatchNumber] [nvarchar](20) NOT NULL,
  [CustodianId] [int] NOT NULL,
  [RecipientId] [int] NOT NULL,
  [EnvelopeNumber] [nvarchar](20) NOT NULL,
  [Description] [nvarchar](100) NOT NULL,
  [AdvanceAmount] [decimal](18, 2) NOT NULL,
  [EnvelopeAmount] [decimal](18, 2) NOT NULL,
  [LineItemAmount] [decimal](18, 2) NOT NULL,
  [Difference] [decimal](18, 2) NOT NULL,
  [PostedDate] [datetime] NULL,
  [Status] [nvarchar](10) NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [Modifieddate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  [Prodid] [int] NOT NULL,
  [PostedBy] [int] NULL,
  [ClosePeriodId] [int] NOT NULL,
  [MirrorStatus] [varchar](10) NULL
)
GO