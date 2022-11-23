CREATE TABLE [dbo].[PayrollBankSetup] (
  [PayrollBankSetupID] [int] IDENTITY,
  [DefaultCompanyID] [int] NULL,
  [DefaultBankId] [int] NULL,
  [DefaultCurrency] [nvarchar](50) NULL,
  [PRSource] [int] NULL,
  [APSource] [int] NULL,
  [createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [ProdID] [int] NOT NULL,
  [VendorID] [int] NULL,
  CONSTRAINT [PK_PayrollBankSetup] PRIMARY KEY CLUSTERED ([PayrollBankSetupID])
)
GO