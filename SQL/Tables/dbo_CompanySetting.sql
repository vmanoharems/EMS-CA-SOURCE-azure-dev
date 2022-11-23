CREATE TABLE [dbo].[CompanySetting] (
  [SettingID] [int] IDENTITY,
  [CompanyID] [int] NOT NULL,
  [AccountingCurrency] [nvarchar](50) NOT NULL,
  [ReportLabel] [nvarchar](20) NOT NULL,
  [RealTimeCurrency] [bit] NOT NULL,
  [FringeAccountID] [int] NOT NULL,
  [LaborAccountID] [int] NOT NULL,
  [SuspenseAccountID] [int] NOT NULL,
  [Createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [ProdID] [int] NOT NULL,
  CONSTRAINT [PK_CompSetting] PRIMARY KEY CLUSTERED ([SettingID])
)
GO