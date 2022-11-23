CREATE TABLE [dbo].[InvoiceLine] (
  [InvoiceLineID] [int] IDENTITY,
  [InvoiceID] [int] NOT NULL,
  [COAID] [int] NOT NULL,
  [Amount] [decimal](18, 2) NOT NULL CONSTRAINT [df_InvoiceLine_Amount] DEFAULT (0.00),
  [LineDescription] [varchar](100) NOT NULL,
  [InvoiceLinestatus] [varchar](50) NOT NULL,
  [COAString] [varchar](200) NOT NULL,
  [Transactionstring] [varchar](200) NULL,
  [Polineid] [int] NULL,
  [CreatedDate] [datetime] NOT NULL CONSTRAINT [df_InvoiceLine_CreatedDate] DEFAULT (getdate()),
  [CreatedBy] [int] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ProdID] [int] NOT NULL,
  [PaymentID] [int] NULL,
  [SetId] [int] NULL,
  [SeriesId] [int] NULL,
  [ClearedFlag] [bit] NOT NULL CONSTRAINT [df_InvoiceLine_ClearedFlag] DEFAULT (0),
  [TaxCode] [nvarchar](50) NULL,
  CONSTRAINT [PK_InvoiceLine] PRIMARY KEY CLUSTERED ([InvoiceLineID])
)
GO

ALTER TABLE [dbo].[InvoiceLine]
  ADD CONSTRAINT [FK_Invoice_COAID] FOREIGN KEY ([COAID]) REFERENCES [dbo].[COA] ([COAID])
GO

ALTER TABLE [dbo].[InvoiceLine]
  ADD CONSTRAINT [FK_Invoice_InvoiceID] FOREIGN KEY ([InvoiceID]) REFERENCES [dbo].[Invoice] ([Invoiceid])
GO

ALTER TABLE [dbo].[InvoiceLine]
  ADD CONSTRAINT [FK_Invoice_Polineid] FOREIGN KEY ([Polineid]) REFERENCES [dbo].[PurchaseOrderLine] ([POlineID])
GO