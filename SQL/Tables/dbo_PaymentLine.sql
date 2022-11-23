CREATE TABLE [dbo].[PaymentLine] (
  [PaymentLineId] [int] IDENTITY,
  [PaymentId] [int] NULL,
  [InvoiceId] [int] NULL,
  [InvoiceAmount] [decimal](18, 2) NULL,
  [CreatedBy] [int] NULL,
  [CreatedDate] [datetime] NULL,
  [ModifyBy] [int] NULL,
  [ModifyDate] [datetime] NULL,
  [ProdId] [int] NULL,
  [BankID] [int] NULL,
  [CheckNumber] [varchar](50) NULL,
  [isdeleted] [bit] NOT NULL DEFAULT (0),
  CONSTRAINT [PK_PaymentLine] PRIMARY KEY CLUSTERED ([PaymentLineId])
)
GO