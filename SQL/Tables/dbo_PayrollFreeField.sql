CREATE TABLE [dbo].[PayrollFreeField] (
  [PayrollFreeFieldID] [int] IDENTITY,
  [FreeField1] [int] NULL,
  [FreeField2] [int] NULL,
  [FreeField3] [int] NULL,
  [createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [ProdID] [int] NOT NULL,
  [CompanyId] [int] NULL,
  CONSTRAINT [PK_PayrollKeys] PRIMARY KEY CLUSTERED ([PayrollFreeFieldID])
)
GO