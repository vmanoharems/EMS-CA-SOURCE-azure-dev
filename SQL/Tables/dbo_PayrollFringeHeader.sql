CREATE TABLE [dbo].[PayrollFringeHeader] (
  [PayrollFringeHeaderID] [int] IDENTITY,
  [StartRange] [int] NOT NULL,
  [EndRange] [int] NOT NULL,
  [LOId] [int] NULL,
  [EpiId] [int] NULL,
  [SetId] [int] NULL,
  [BananasId] [int] NULL,
  [TransactionCode] [int] NULL,
  [FringeAccount] [int] NOT NULL,
  [ProdID] [int] NOT NULL,
  [createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [CompanyID] [int] NULL,
  CONSTRAINT [PK_PayrollFringeHeader] PRIMARY KEY CLUSTERED ([PayrollFringeHeaderID])
)
GO