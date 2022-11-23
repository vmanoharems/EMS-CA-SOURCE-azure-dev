CREATE TABLE [dbo].[UserProduction] (
  [UserproductionId] [int] NOT NULL,
  [UserId] [int] NULL,
  [Prodid] [int] NULL,
  [Createddate] [datetime] NULL,
  [modifieddate] [datetime] NULL,
  [createdby] [int] NULL,
  [modifiedby] [int] NULL,
  [Groupbatchaccess] [bit] NULL,
  [Canclose] [bit] NULL,
  [Allbatchaccess] [bit] NULL
)
GO