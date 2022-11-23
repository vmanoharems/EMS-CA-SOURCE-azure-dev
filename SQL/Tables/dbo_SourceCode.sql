CREATE TABLE [dbo].[SourceCode] (
  [SourceCodeID] [int] IDENTITY,
  [Code] [nvarchar](20) NOT NULL,
  [Description] [nvarchar](100) NOT NULL,
  [AP] [bit] NOT NULL,
  [JE] [bit] NOT NULL,
  [PO] [bit] NOT NULL,
  [PC] [bit] NOT NULL,
  [AR] [bit] NOT NULL,
  [PR] [bit] NOT NULL,
  [WT] [bit] NULL,
  [Thirdparty] [nvarchar](50) NULL,
  [Createddate] [datetime] NOT NULL,
  [ModidiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [CreatedBy] [int] NOT NULL,
  [ProdID] [int] NOT NULL,
  CONSTRAINT [PK_SourceCode] PRIMARY KEY CLUSTERED ([SourceCodeID])
)
GO