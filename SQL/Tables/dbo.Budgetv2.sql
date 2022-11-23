CREATE TABLE [dbo].[Budgetv2] (
  [BudgetID] [int] IDENTITY,
  [BudgetName] [varchar](50) NOT NULL,
  [BudgetDescription] [varchar](200) NOT NULL,
  [BudgetType] [tinyint] NOT NULL,
  [BudgetOrigin] [int] NULL,
  [segmentJSON] [nvarchar](200) NULL,
  [createdby] [int] NOT NULL,
  [createddate] [datetime] NOT NULL CONSTRAINT [DF_Budgetv2_createddate] DEFAULT (getdate()),
  [modifiedby] [int] NULL,
  [modifieddate] [date] NULL,
  [prodID] [int] NOT NULL,
  [islocked] [bit] NOT NULL DEFAULT (0),
  [Active] [bit] NOT NULL DEFAULT (1),
  CONSTRAINT [PK_Budgetv2] PRIMARY KEY CLUSTERED ([BudgetID]),
  CONSTRAINT [UK_Budgetv2_BudgetName] UNIQUE ([BudgetName])
)
GO

ALTER TABLE [dbo].[Budgetv2]
  ADD CONSTRAINT [FK_Budgetv2_BudgetOrigin] FOREIGN KEY ([BudgetOrigin]) REFERENCES [dbo].[Budgetv2] ([BudgetID])
GO

ALTER TABLE [dbo].[Budgetv2]
  ADD CONSTRAINT [FK_Budgetv2_BudgetType] FOREIGN KEY ([BudgetType]) REFERENCES [dbo].[Budgetv2_Types] ([BudgetType])
GO