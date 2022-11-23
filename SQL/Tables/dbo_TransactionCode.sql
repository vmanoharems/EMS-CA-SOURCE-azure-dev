CREATE TABLE [dbo].[TransactionCode] (
  [TransactionCodeID] [int] IDENTITY,
  [Description] [nvarchar](100) NOT NULL,
  [TransCode] [nvarchar](10) NOT NULL,
  [Status] [bit] NOT NULL,
  [ProdID] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  CONSTRAINT [PK_TransactionCode] PRIMARY KEY CLUSTERED ([TransactionCodeID])
)
GO