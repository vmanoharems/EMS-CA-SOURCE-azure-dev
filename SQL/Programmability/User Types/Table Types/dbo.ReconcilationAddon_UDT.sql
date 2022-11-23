CREATE TYPE [dbo].[ReconcilationAddon_UDT] AS TABLE (
  [action] [varchar](50) NOT NULL,
  [ID] [int] NOT NULL,
  [ReconcilationID] [int] NOT NULL,
  [SaveDate] [datetime] NOT NULL,
  [Status] [varchar](50) NOT NULL,
  [UserID] [int] NOT NULL,
  [JEID] [int] NOT NULL
)
GO