CREATE TABLE [dbo].[Company] (
  [CompanyID] [int] IDENTITY,
  [CompanyCode] [nvarchar](5) NOT NULL,
  [ProductionTitle] [nvarchar](50) NOT NULL,
  [CompanyName] [nvarchar](50) NOT NULL,
  [Address1] [nvarchar](50) NOT NULL,
  [Address2] [nvarchar](50) NULL,
  [Address3] [nvarchar](50) NULL,
  [City] [nvarchar](50) NOT NULL,
  [State] [nvarchar](50) NOT NULL,
  [Zip] [nvarchar](10) NOT NULL,
  [CompanyPhone] [nvarchar](16) NOT NULL,
  [Contact] [nvarchar](30) NOT NULL,
  [Entry] [int] NOT NULL,
  [Cost] [int] NOT NULL,
  [Format] [nvarchar](20) NOT NULL,
  [Status] [nvarchar](20) NOT NULL,
  [Createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [ProdID] [int] NOT NULL,
  [Defaultflag] [bit] NOT NULL,
  [FiscalStartDate] [datetime] NULL,
  [DefaultValue] [nvarchar](50) NULL,
  [PeriodStart] [datetime] NULL,
  [Country] [nvarchar](50) NOT NULL,
  [PeriodStartType] [varchar](50) NULL,
  CONSTRAINT [PK_Company] PRIMARY KEY CLUSTERED ([CompanyID])
)
GO

CREATE UNIQUE INDEX [CO_UQ_CompanyCode]
  ON [dbo].[Company] ([CompanyCode])
GO

SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE TRIGGER [dbo].[Generate_Periods] 
   ON  [Company]
   AFTER INSERT
AS 
BEGIN
	
	SET NOCOUNT ON;
	declare @CompanyID int

   Select @CompanyID=CompanyId from Inserted

   exec GenerateClosePeriodForCompany @CompanyID

END
GO