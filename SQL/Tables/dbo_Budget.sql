CREATE TABLE [dbo].[Budget] (
  [BudgetId] [int] IDENTITY,
  [Prodid] [int] NOT NULL,
  [BudgetName] [nvarchar](50) NOT NULL,
  [Createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [Description] [nvarchar](100) NULL,
  CONSTRAINT [PK_Budget] PRIMARY KEY CLUSTERED ([BudgetId])
)
GO