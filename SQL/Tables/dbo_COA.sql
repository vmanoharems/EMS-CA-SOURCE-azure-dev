CREATE TABLE [dbo].[COA] (
  [COAID] [int] IDENTITY,
  [COACode] [nvarchar](850) NOT NULL,
  [ParentCode] [nvarchar](max) NULL,
  [Description] [nvarchar](200) NULL,
  [SS1] [nvarchar](50) NULL,
  [SS2] [nvarchar](50) NULL,
  [SS3] [nvarchar](50) NULL,
  [SS4] [nvarchar](50) NULL,
  [SS5] [nvarchar](50) NULL,
  [SS6] [nvarchar](50) NULL,
  [SS7] [nvarchar](50) NULL,
  [SS8] [nvarchar](50) NULL,
  [ProdId] [int] NULL,
  [DetailLevel] [int] NULL,
  [AccountId] [int] NULL,
  [AccountTypeid] [int] NULL,
  CONSTRAINT [PK_COANew] PRIMARY KEY CLUSTERED ([COAID]) WITH (IGNORE_DUP_KEY = ON),
  UNIQUE ([COACode]) WITH (IGNORE_DUP_KEY = ON)
)
GO

ALTER TABLE [dbo].[COA]
  ADD CONSTRAINT [FK_COA_accountid] FOREIGN KEY ([AccountId]) REFERENCES [dbo].[TblAccounts] ([AccountId])
GO