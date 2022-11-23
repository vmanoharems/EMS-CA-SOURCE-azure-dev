CREATE TABLE [dbo].[TblAccounts] (
  [AccountId] [int] IDENTITY,
  [SegmentId] [int] NULL,
  [AccountCode] [nvarchar](50) NULL,
  [AccountName] [nvarchar](200) NULL,
  [AccountTypeId] [int] NULL,
  [BalanceSheet] [bit] NULL,
  [Status] [bit] NOT NULL,
  [Posting] [bit] NULL,
  [SubLevel] [int] NULL,
  [SegmentType] [nvarchar](50) NOT NULL,
  [ParentId] [int] NULL,
  [CreatedDate] [datetime] NOT NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ProdId] [int] NOT NULL,
  CONSTRAINT [PK_Accounts] PRIMARY KEY CLUSTERED ([AccountId]),
  CONSTRAINT [UK_tblAccounts_AccountCodeSegment] UNIQUE ([AccountCode], [SegmentId])
)
GO