CREATE TABLE [dbo].[Invoice] (
  [Invoiceid] [int] IDENTITY,
  [InvoiceNumber] [varchar](200) NOT NULL,
  [CompanyID] [int] NOT NULL,
  [VendorID] [int] NOT NULL,
  [VendorName] [varchar](200) NULL,
  [ThirdParty] [bit] NOT NULL CONSTRAINT [df_Invoice_ThirdParty] DEFAULT (0),
  [WorkRegion] [varchar](50) NULL,
  [Description] [varchar](50) NOT NULL,
  [OriginalAmount] [decimal](18, 2) NOT NULL CONSTRAINT [df_Invoice_OriginalAmount] DEFAULT (0.00),
  [CurrentBalance] [decimal](18, 2) NOT NULL CONSTRAINT [df_Invoice_CurrentBalance] DEFAULT (0.00),
  [NewItemamount] [decimal](18, 2) NULL,
  [Newbalance] [decimal](18, 2) NULL,
  [BatchNumber] [varchar](50) NOT NULL,
  [BankId] [int] NOT NULL,
  [InvoiceDate] [date] NOT NULL,
  [Duedate] [date] NULL,
  [CheckGroupnumber] [varchar](50) NULL,
  [Payby] [varchar](50) NOT NULL,
  [InvoiceStatus] [varchar](50) NOT NULL,
  [CreatedDate] [datetime] NOT NULL CONSTRAINT [df_Invoice_CreatedDate] DEFAULT (getdate()),
  [CreatedBy] [int] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ProdID] [int] NOT NULL,
  [Amount] [decimal](18, 2) NOT NULL CONSTRAINT [df_Invoice_Amount] DEFAULT (0.00),
  [ClosePeriodId] [int] NOT NULL,
  [RequiredTaxCode] [bit] NOT NULL CONSTRAINT [df_Invoice_RequiredTaxCode] DEFAULT (0),
  [MirrorStatus] [varchar](10) NOT NULL CONSTRAINT [DF_Mirror] DEFAULT (0),
  CONSTRAINT [PK_Invoice] PRIMARY KEY CLUSTERED ([Invoiceid])
)
GO

ALTER TABLE [dbo].[Invoice]
  ADD CONSTRAINT [FK_Invoice_BankID] FOREIGN KEY ([BankId]) REFERENCES [dbo].[BankInfo] ([BankId])
GO

ALTER TABLE [dbo].[Invoice]
  ADD CONSTRAINT [FK_Invoice_ClosePeriodID] FOREIGN KEY ([ClosePeriodId]) REFERENCES [dbo].[ClosePeriod] ([ClosePeriodId])
GO

ALTER TABLE [dbo].[Invoice]
  ADD CONSTRAINT [FK_Invoice_CompanyID] FOREIGN KEY ([CompanyID]) REFERENCES [dbo].[Company] ([CompanyID])
GO

ALTER TABLE [dbo].[Invoice]
  ADD CONSTRAINT [FK_Invoice_VendorID] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[tblVendor] ([VendorID])
GO