CREATE TABLE [dbo].[Budgetv2_Types] (
  [BudgetType] [tinyint] IDENTITY,
  [BudgetTypeDescription] [varchar](50) NOT NULL,
  CONSTRAINT [PK_Budgetv2_Types] PRIMARY KEY CLUSTERED ([BudgetType]),
  CONSTRAINT [UK_Budgetv2_Types_Description] UNIQUE ([BudgetTypeDescription])
)
GO