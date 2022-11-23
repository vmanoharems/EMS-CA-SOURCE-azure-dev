CREATE TABLE [dbo].[taxinfo] (
  [taxinfoID] [int] IDENTITY,
  [CompanyID] [int] NOT NULL,
  [federaltaxagency] [nvarchar](50) NULL,
  [federaltaxform] [nvarchar](200) NULL,
  [EIN] [nvarchar](20) NULL,
  [CompanyTCC] [nvarchar](20) NULL,
  [StateID] [nvarchar](50) NULL,
  [StatetaxID] [nvarchar](50) NULL,
  [CreatedBy] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedBy] [int] NULL,
  [ModifiedDate] [datetime] NULL,
  [ProdID] [int] NOT NULL,
  CONSTRAINT [PK_taxinfo] PRIMARY KEY CLUSTERED ([taxinfoID])
)
GO