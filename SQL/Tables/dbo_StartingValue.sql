CREATE TABLE [dbo].[StartingValue] (
  [StartingValueID] [int] IDENTITY,
  [CompanyID] [int] NOT NULL,
  [AP] [nvarchar](50) NOT NULL,
  [PO] [nvarchar](50) NOT NULL,
  [Invoice] [nvarchar](50) NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  [ProdID] [int] NOT NULL,
  CONSTRAINT [PK_StartingValue] PRIMARY KEY CLUSTERED ([StartingValueID])
)
GO