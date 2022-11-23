CREATE TABLE [dbo].[CheckRunStatus] (
  [CheckRunID] [int] IDENTITY,
  [Status] [varchar](50) NULL,
  [UserID] [int] NULL,
  [BankID] [int] NULL,
  [ActualCheckRunID] [int] NULL
)
GO