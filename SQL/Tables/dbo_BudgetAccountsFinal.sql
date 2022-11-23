CREATE TABLE [dbo].[BudgetAccountsFinal] (
  [BudgetAccountID] [int] IDENTITY,
  [CategoryId] [int] NULL,
  [AccountID] [int] NULL,
  [AccountNumber] [nvarchar](50) NULL,
  [AccountDesc] [nvarchar](100) NULL,
  [AccountFringe] [nvarchar](20) NULL,
  [AccountOriginal] [nvarchar](20) NULL,
  [AccountTotal] [nvarchar](20) NULL,
  [AccountVariance] [nvarchar](20) NULL,
  [BudgetFileID] [int] NULL,
  [BudgetID] [int] NULL,
  [CreatedDate] [datetime] NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NULL,
  [ModifiedBy] [int] NULL,
  [COAID] [int] NULL,
  [COACODE] [varchar](500) NULL,
  [DetailLevel] [int] NULL,
  [ParentID] [int] NULL
)
GO