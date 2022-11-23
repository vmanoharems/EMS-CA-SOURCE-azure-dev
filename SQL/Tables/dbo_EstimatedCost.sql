CREATE TABLE [dbo].[EstimatedCost] (
  [ID] [int] IDENTITY,
  [DetailLevel] [int] NULL,
  [BudgetId] [int] NOT NULL,
  [BudgetFileID] [int] NOT NULL,
  [ETC] [decimal](18, 2) NULL,
  [EFC] [decimal](18, 2) NULL,
  [COAID] [int] NOT NULL,
  [RefID] [int] NULL,
  [ExpandValue] [int] NULL,
  [Budget] [varchar](50) NULL,
  [BlankETC] [varchar](50) NULL,
  [BlankEFC] [varchar](50) NULL
)
GO