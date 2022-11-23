CREATE TABLE [dbo].[CAUsers] (
  [CAUserId] [int] IDENTITY,
  [UserID] [int] NOT NULL,
  [ProdID] [int] NOT NULL,
  [Name] [nvarchar](50) NOT NULL,
  [Title] [nvarchar](50) NOT NULL,
  [Email] [nvarchar](100) NOT NULL,
  [Status] [bit] NOT NULL CONSTRAINT [DF_CAUsers_Status] DEFAULT (0),
  [Createddate] [datetime] NOT NULL CONSTRAINT [DF_CAUsers_Createddate] DEFAULT (getdate()),
  [modifieddate] [datetime] NULL,
  [createdby] [int] NOT NULL,
  [modifiedby] [int] NULL,
  [GroupBatchAccess] [bit] NOT NULL CONSTRAINT [DF_CAUsers_GroupBatchAccess] DEFAULT (0),
  [CanClose] [bit] NOT NULL CONSTRAINT [DF_CAUsers_CanClose] DEFAULT (0),
  [AllBatchAccess] [bit] NULL CONSTRAINT [DF_CAUsers_AllBatchAccess] DEFAULT (0),
  CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([CAUserId]),
  CONSTRAINT [CK_CAUsers_Name] CHECK ([Name]<>'')
)
GO