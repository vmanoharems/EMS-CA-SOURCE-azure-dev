CREATE TABLE [dbo].[Variance] (
  [ID] [int] IDENTITY,
  [BudgetID] [int] NULL,
  [BudgetFileID] [int] NULL,
  [COAID] [int] NULL,
  [UserID] [int] NULL,
  [Notes] [varchar](2000) NULL,
  [SaveDate] [datetime] NULL,
  [ProdID] [int] NULL,
  [EFCOLD] [decimal](18, 2) NULL,
  [EFCNEW] [decimal](18, 2) NULL,
  [Period] [varchar](50) NULL
)
GO