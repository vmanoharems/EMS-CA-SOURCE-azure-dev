CREATE TABLE [dbo].[Custodian] (
  [CustodianID] [int] IDENTITY,
  [CustodianCode] [nvarchar](10) NOT NULL,
  [Currency] [nvarchar](10) NOT NULL CONSTRAINT [DF_CURRENCY] DEFAULT (N'USD'),
  [VendorID] [int] NOT NULL,
  [COAID] [int] NOT NULL,
  [COACode] [nvarchar](100) NOT NULL,
  [Setid] [int] NULL,
  [SeriesID] [int] NULL,
  [Prodid] [int] NOT NULL,
  [CompanyID] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL CONSTRAINT [DF_CreatedDate] DEFAULT (getdate()),
  [Modifieddate] [datetime] NULL,
  [Createdy] [int] NOT NULL,
  [Modifiedby] [int] NULL,
  [Status] [bit] NOT NULL CONSTRAINT [DF_Status] DEFAULT (1),
  CONSTRAINT [PK_Custodian] PRIMARY KEY CLUSTERED ([CustodianID])
)
GO

ALTER TABLE [dbo].[Custodian]
  ADD CONSTRAINT [PCC_FK_COAID] FOREIGN KEY ([COAID]) REFERENCES [dbo].[COA] ([COAID])
GO