CREATE TABLE [dbo].[CheckRun] (
  [CheckRunID] [int] IDENTITY,
  [UserID] [int] NULL,
  [Status] [varchar](50) NULL,
  [StartDate] [datetime] NULL,
  [EndDate] [datetime] NULL,
  [BankID] [int] NULL,
  [ProdID] [int] NULL
)
GO