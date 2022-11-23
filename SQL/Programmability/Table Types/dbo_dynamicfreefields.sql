CREATE TYPE [dbo].[dynamicfreefields] AS TABLE (
  [JournalEntryDetailID] [int] NOT NULL,
  [JournalEntryID] [int] NOT NULL,
  [ProdID] [int] NOT NULL,
  [OriginalItemNumber] [int] NOT NULL,
  [OriginalItem] [varchar](10) NOT NULL,
  [ColumnNameID] [int] NOT NULL,
  [ColumnName] [varchar](10) NOT NULL,
  [TransactionCodeString] [varchar](500) NOT NULL,
  [ItemNumber] [int] NOT NULL,
  [Item] [varchar](10) NOT NULL
)
GO