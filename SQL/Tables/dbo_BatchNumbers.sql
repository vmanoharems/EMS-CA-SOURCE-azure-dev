CREATE TABLE [dbo].[BatchNumbers] (
  [BatchId] [int] IDENTITY,
  [UserId] [int] NULL,
  [ProdId] [int] NULL,
  [BatchNumber] [nvarchar](12) NOT NULL,
  [CreateDate] [datetime] NULL,
  [InactiveDate] [datetime] NULL,
  [Status] [bit] NULL,
  CONSTRAINT [PK_BatchNumbers] PRIMARY KEY CLUSTERED ([BatchId]),
  CONSTRAINT [AK_UserBatch] UNIQUE ([UserId], [BatchNumber])
)
GO