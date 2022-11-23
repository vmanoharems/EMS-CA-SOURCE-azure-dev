CREATE TABLE [dbo].[CheckRunAddon] (
  [CheckRunAddonID] [int] IDENTITY,
  [CheckRunID] [int] NULL,
  [PaymentID] [int] NULL,
  [CheckNo] [varchar](50) NULL,
  [Status] [varchar](50) NULL
)
GO