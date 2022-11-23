CREATE TABLE [dbo].[Module] (
  [ModuleId] [int] NOT NULL,
  [ModuleName] [nvarchar](50) NOT NULL,
  [ParentID] [int] NULL,
  [ModuleLevel] [int] NOT NULL,
  [Children] [int] NULL,
  CONSTRAINT [PK_module] PRIMARY KEY CLUSTERED ([ModuleId])
)
GO