CREATE TABLE [dbo].[Mydefault] (
  [MyDefaultId] [int] IDENTITY,
  [Type] [nvarchar](50) NOT NULL,
  [UserType] [nvarchar](20) NOT NULL,
  [RefId] [int] NULL,
  [Defvalue] [nvarchar](50) NULL,
  [UserId] [int] NOT NULL,
  [ProdId] [int] NOT NULL,
  CONSTRAINT [PK_Mydefault] PRIMARY KEY CLUSTERED ([MyDefaultId])
)
GO