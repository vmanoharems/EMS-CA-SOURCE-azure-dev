CREATE TABLE [dbo].[TransactionValue] (
  [TransactionValueID] [int] IDENTITY,
  [TransactionCodeID] [int] NOT NULL,
  [TransValue] [nvarchar](50) NULL,
  [Status] [bit] NOT NULL,
  [Description] [nvarchar](50) NULL,
  [ProdID] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [Modifiedate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  CONSTRAINT [PK_TransactionValue] PRIMARY KEY CLUSTERED ([TransactionValueID])
)
GO