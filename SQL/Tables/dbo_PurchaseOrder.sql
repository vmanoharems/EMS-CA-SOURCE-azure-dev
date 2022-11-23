CREATE TABLE [dbo].[PurchaseOrder] (
  [POID] [int] IDENTITY,
  [PONumber] [varchar](50) NOT NULL,
  [CompanyID] [int] NOT NULL,
  [VendorID] [int] NOT NULL,
  [VendorName] [varchar](50) NOT NULL CONSTRAINT [PO_DF_VendorName] DEFAULT (N''),
  [ThirdParty] [bit] NOT NULL CONSTRAINT [PO_DF_ThirdParty] DEFAULT (0),
  [WorkRegion] [varchar](50) NULL,
  [Description] [varchar](50) NOT NULL,
  [CurrentBalance] [varchar](50) NULL,
  [BatchNumber] [nvarchar](12) NOT NULL,
  [ClosePOuponPayment] [bit] NOT NULL CONSTRAINT [PO_DF_ClosePOuponPayment] DEFAULT (1),
  [Payby] [varchar](50) NOT NULL,
  [Status] [varchar](50) NOT NULL,
  [CreatedDate] [datetime] NOT NULL CONSTRAINT [PO_DF_CreatedDate] DEFAULT (getdate()),
  [CreatedBy] [int] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ProdID] [int] NOT NULL,
  [PODate] [date] NOT NULL,
  [COCode] [nvarchar](5) NOT NULL,
  [ClosePeriodId] [int] NOT NULL,
  [RequiredTaxCode] [bit] NULL,
  [OriginalAmount] [decimal](18, 2) NOT NULL CONSTRAINT [PO_DF_OriginalAmount] DEFAULT (0.00),
  [AdjustmentTotal] [decimal](18, 2) NOT NULL CONSTRAINT [PO_DF_AdjustmentTotal] DEFAULT (0.00),
  [RelievedTotal] [decimal](18, 2) NOT NULL CONSTRAINT [PO_DF_RelievedTotal] DEFAULT (0.00),
  [BalanceAmount] [decimal](18, 2) NOT NULL CONSTRAINT [PO_DF_BalanceAmount] DEFAULT (0.00),
  CONSTRAINT [PK_PurchaseOrder] PRIMARY KEY CLUSTERED ([POID])
)
GO

SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE TRIGGER [UpdatePOAmount] 
   ON  [dbo].[PurchaseOrder]
   AFTER Update
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

declare @Balance decimal(18,2);
declare @POID int;

  select @POID=POID,@Balance=BalanceAmount from Inserted;

  if (1=0)--@Balance=0)
 begin
 update PurchaseOrder set Status='Closed' where POID=@POID;

 end 

END
GO

ALTER TABLE [dbo].[PurchaseOrder]
  ADD CONSTRAINT [PO_FK_ClosePeriodId] FOREIGN KEY ([ClosePeriodId]) REFERENCES [dbo].[ClosePeriod] ([ClosePeriodId])
GO

ALTER TABLE [dbo].[PurchaseOrder]
  ADD CONSTRAINT [PO_FK_COCode] FOREIGN KEY ([COCode]) REFERENCES [dbo].[Company] ([CompanyCode])
GO

ALTER TABLE [dbo].[PurchaseOrder]
  ADD CONSTRAINT [PO_FK_CompanyID] FOREIGN KEY ([CompanyID]) REFERENCES [dbo].[Company] ([CompanyID])
GO

ALTER TABLE [dbo].[PurchaseOrder]
  ADD CONSTRAINT [PO_FK_VendorID] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[tblVendor] ([VendorID])
GO