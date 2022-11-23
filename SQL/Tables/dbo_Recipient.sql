CREATE TABLE [dbo].[Recipient] (
  [RecipientID] [int] IDENTITY,
  [VendorID] [int] NOT NULL,
  [COAID] [int] NOT NULL,
  [Prodid] [int] NOT NULL,
  [Createddate] [datetime] NOT NULL,
  [Modifieddate] [datetime] NULL,
  [Createdby] [int] NOT NULL,
  [CoaString] [nvarchar](100) NOT NULL,
  [ModifiedBy] [int] NULL,
  [SetId] [int] NULL,
  [SeriesId] [int] NULL,
  [Status] [bit] NOT NULL,
  CONSTRAINT [PK_Recipient] PRIMARY KEY CLUSTERED ([RecipientID])
)
GO

ALTER TABLE [dbo].[Recipient]
  ADD CONSTRAINT [PCR_FK_Recipient] FOREIGN KEY ([COAID]) REFERENCES [dbo].[COA] ([COAID])
GO