CREATE TYPE [dbo].[UpsertResult_InvoiceLine] AS TABLE (
  [Result] [varchar](50) NULL,
  [InvoiceLineID] [int] NOT NULL,
  [InvoiceID] [int] NOT NULL,
  [COAID] [int] NOT NULL,
  [Amount] [decimal](18, 3) NOT NULL,
  [LineDescription] [varchar](100) NOT NULL,
  [InvoiceLinestatus] [varchar](50) NOT NULL,
  [COAString] [varchar](200) NOT NULL,
  [Transactionstring] [varchar](200) NULL,
  [Polineid] [int] NULL,
  [CreatedDate] [datetime] NOT NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ProdID] [int] NOT NULL,
  [PaymentID] [int] NULL,
  [SetId] [int] NULL,
  [SeriesId] [int] NULL,
  [ClearedFlag] [bit] NULL,
  [TaxCode] [nvarchar](50) NULL
)
GO