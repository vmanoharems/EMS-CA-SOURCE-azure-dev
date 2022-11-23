CREATE TABLE [dbo].[PayrollOffset] (
  [PayrollOffsetID] [int] IDENTITY,
  [OffsetType] [nvarchar](50) NULL,
  [OffsetAccount] [int] NULL,
  [Offsetdescription] [nvarchar](50) NOT NULL,
  [Active] [bit] NOT NULL,
  [createddate] [datetime] NOT NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [ProdID] [int] NOT NULL,
  [CompanyID] [int] NOT NULL,
  CONSTRAINT [PK_PayrollOffset] PRIMARY KEY CLUSTERED ([PayrollOffsetID])
)
GO