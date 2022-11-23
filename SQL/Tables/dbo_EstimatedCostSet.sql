CREATE TABLE [dbo].[EstimatedCostSet] (
  [ID] [int] IDENTITY,
  [BudgetID] [int] NULL,
  [BudgetFileID] [int] NULL,
  [DetailLevel] [int] NULL,
  [COAID] [int] NULL,
  [SetID] [int] NULL,
  [EFC] [varchar](50) NULL,
  [ETC] [varchar](50) NULL,
  [Budget] [varchar](50) NULL
)
GO