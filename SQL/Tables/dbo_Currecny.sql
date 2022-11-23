CREATE TABLE [dbo].[Currecny] (
  [CurrencyID] [int] IDENTITY,
  [CompanyID] [int] NOT NULL,
  [CurrencyName] [nvarchar](50) NOT NULL,
  [Currencycode] [nvarchar](10) NOT NULL,
  [ExchangeRate] [decimal](18, 2) NULL,
  [Status] [nvarchar](20) NOT NULL,
  [createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [DefaultFlag] [bit] NOT NULL,
  [ProdID] [int] NOT NULL,
  CONSTRAINT [PK_currency] PRIMARY KEY CLUSTERED ([CurrencyID])
)
GO