CREATE TABLE [dbo].[TaxCodeDetail] (
  [TaxID] [int] IDENTITY,
  [TaxCode] [nvarchar](2) NOT NULL,
  [TaxDescription] [nvarchar](50) NOT NULL,
  [Active] [bit] NOT NULL DEFAULT (1),
  [Createdby] [int] NOT NULL,
  [Modifiedby] [int] NULL,
  [Createddate] [datetime] NOT NULL DEFAULT (getdate()),
  [modifieddate] [datetime] NULL,
  [ProdId] [int] NOT NULL,
  CONSTRAINT [PK_TaxCodes] PRIMARY KEY CLUSTERED ([TaxID]),
  CONSTRAINT [UniqueTaxCode] UNIQUE ([TaxCode])
)
GO