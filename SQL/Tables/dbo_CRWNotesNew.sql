CREATE TABLE [dbo].[CRWNotesNew] (
  [CRWNotesID] [int] IDENTITY,
  [BudgetID] [int] NULL,
  [BudgetFileID] [int] NULL,
  [COAID] [int] NULL,
  [UserID] [int] NULL,
  [Notes] [varchar](500) NULL,
  [NoteDate] [datetime] NULL,
  [Status] [varchar](50) NULL,
  [ProdID] [int] NULL
)
GO