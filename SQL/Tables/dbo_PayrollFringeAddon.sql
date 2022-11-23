CREATE TABLE [dbo].[PayrollFringeAddon] (
  [PayrollFringeAddonID] [int] IDENTITY,
  [PayrollFringeHeaderID] [int] NOT NULL,
  [TransactionCodeId] [int] NOT NULL,
  [TransactionValueId] [int] NOT NULL,
  [createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [ProdID] [int] NOT NULL,
  [CompanyID] [int] NOT NULL,
  CONSTRAINT [PK_PayrollFringetable_1] PRIMARY KEY CLUSTERED ([PayrollFringeAddonID])
)
GO