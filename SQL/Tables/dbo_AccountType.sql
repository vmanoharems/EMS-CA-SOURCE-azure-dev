CREATE TABLE [dbo].[AccountType] (
  [AccountTypeID] [int] IDENTITY,
  [AccountTypeName] [nvarchar](100) NOT NULL,
  [Code] [nvarchar](10) NOT NULL,
  [Above] [bit] NOT NULL,
  [Status] [bit] NOT NULL,
  [ProdId] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  CONSTRAINT [PK_AccountType] PRIMARY KEY CLUSTERED ([AccountTypeID])
)
GO