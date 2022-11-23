CREATE TABLE [dbo].[CompanyGroup] (
  [GroupId] [int] IDENTITY,
  [GroupName] [nvarchar](50) NOT NULL,
  [Prodid] [int] NOT NULL,
  [Status] [nvarchar](20) NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  [AllCompanyFlag] [bit] NOT NULL,
  [AllowPeriodClose] [bit] NOT NULL,
  [GroupBatchAccess] [bit] NOT NULL,
  CONSTRAINT [PK_Group] PRIMARY KEY CLUSTERED ([GroupId])
)
GO