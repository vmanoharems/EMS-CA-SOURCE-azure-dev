CREATE TABLE [dbo].[UserAccess] (
  [UserGroupID] [int] IDENTITY,
  [UserID] [int] NOT NULL,
  [GroupID] [int] NOT NULL,
  [ProdID] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  CONSTRAINT [PK_Usergroups] PRIMARY KEY CLUSTERED ([UserGroupID])
)
GO