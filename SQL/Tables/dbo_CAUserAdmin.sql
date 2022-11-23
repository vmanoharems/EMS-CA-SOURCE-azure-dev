CREATE TABLE [dbo].[CAUserAdmin] (
  [UserID] [int] NOT NULL,
  [Email] [nvarchar](100) NULL,
  [Password] [nvarchar](100) NULL,
  [AuthenticationCode] [nvarchar](100) NULL,
  [PasswordModiedDate] [datetime] NULL,
  [Accountstatus] [nvarchar](50) NULL,
  [Status] [bit] NULL,
  [Createddate] [datetime] NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NULL,
  [modifiedby] [int] NULL,
  [AdminFlag] [bit] NULL
)
GO