CREATE TYPE [dbo].[Budgetv2_UDT] AS TABLE (
  [Action] [varchar](50) NOT NULL,
  [BudgetID] [int] NOT NULL,
  [BudgetName] [varchar](50) NOT NULL,
  [BudgetDescription] [varchar](200) NOT NULL,
  [BudgetType] [tinyint] NOT NULL,
  [BudgetOrigin] [int] NULL,
  [segmentJSON] [nvarchar](200) NULL,
  [createdby] [int] NOT NULL,
  [createddate] [datetime] NOT NULL,
  [modifiedby] [int] NULL,
  [modifieddate] [date] NULL,
  [prodID] [int] NOT NULL,
  [islocked] [bit] NOT NULL,
  [Active] [bit] NOT NULL
)
GO