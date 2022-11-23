CREATE TABLE [dbo].[CRWv2] (
  [ID] [int] IDENTITY,
  [BudgetID] [int] NOT NULL,
  [PeriodID] [int] NOT NULL,
  [AccountCode] [nvarchar](50) NOT NULL,
  [EditStatusUserID] [int] NULL,
  [version] [int] NOT NULL,
  [EFC] [money] NOT NULL CONSTRAINT [DF_CRWv2_EFC] DEFAULT (0.00),
  [Budget] [money] NOT NULL CONSTRAINT [DF_CRWv2_Budget] DEFAULT (0.00),
  [Notes] [varchar](1000) NULL,
  [createdby] [int] NOT NULL,
  [createddate] [datetime] NOT NULL CONSTRAINT [DF_CRWv2_createddate] DEFAULT (getdate()),
  [modifiedby] [int] NULL,
  [modifieddate] [datetime] NULL,
  CONSTRAINT [PK_CRWv2] PRIMARY KEY CLUSTERED ([ID]),
  CONSTRAINT [UK_CRWv2_AccountCode] UNIQUE ([BudgetID], [PeriodID], [version], [AccountCode])
)
GO

ALTER TABLE [dbo].[CRWv2]
  ADD CONSTRAINT [FK_CRWv2_BudgetID] FOREIGN KEY ([BudgetID]) REFERENCES [dbo].[Budgetv2] ([BudgetID])
GO

ALTER TABLE [dbo].[CRWv2]
  ADD CONSTRAINT [FK_CRWv2_PeriodID] FOREIGN KEY ([PeriodID]) REFERENCES [dbo].[ClosePeriod] ([ClosePeriodId])
GO