CREATE TABLE [dbo].[AccountClearing] (
  [AccountClearingId] [int] IDENTITY,
  [Type] [nvarchar](50) NULL,
  [AccountName] [nvarchar](50) NULL,
  [COAId] [int] NOT NULL,
  [CompanyId] [int] NULL,
  [BankId] [int] NULL,
  [CreatedDate] [datetime] NULL,
  [CreatedBy] [int] NULL,
  [ModifyDate] [datetime] NULL,
  [ModifyBy] [int] NULL,
  [ProdId] [int] NULL,
  [AccountCode] [nvarchar](50) NULL,
  [ClearingType] [nvarchar](50) NULL,
  CONSTRAINT [PK_AccountClearing] PRIMARY KEY CLUSTERED ([AccountClearingId])
)
GO