CREATE TABLE [dbo].[GroupPermission] (
  [PermissionID] [int] IDENTITY,
  [GroupID] [int] NOT NULL,
  [ModuleID] [int] NOT NULL,
  [Access] [nvarchar](20) NOT NULL,
  [ProdID] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  CONSTRAINT [PK_permission] PRIMARY KEY CLUSTERED ([PermissionID])
)
GO