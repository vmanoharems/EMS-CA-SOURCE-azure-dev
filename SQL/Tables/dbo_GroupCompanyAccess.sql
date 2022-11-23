CREATE TABLE [dbo].[GroupCompanyAccess] (
  [GroupAccessID] [int] IDENTITY,
  [GroupID] [int] NOT NULL,
  [CompanyID] [int] NOT NULL,
  [ProdID] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [Modifieddate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  CONSTRAINT [PK_GroupCompanyAccess] PRIMARY KEY CLUSTERED ([GroupAccessID])
)
GO