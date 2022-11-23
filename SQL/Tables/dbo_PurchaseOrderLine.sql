CREATE TABLE [dbo].[PurchaseOrderLine] (
  [POlineID] [int] IDENTITY,
  [POID] [int] NOT NULL,
  [COAID] [int] NOT NULL,
  [Amount] [decimal](18, 2) NOT NULL,
  [LineDescription] [varchar](100) NOT NULL,
  [POLinestatus] [varchar](50) NOT NULL,
  [COAString] [nvarchar](850) NOT NULL,
  [Transactionstring] [varchar](200) NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ProdID] [int] NOT NULL,
  [ThirdPartyVendor] [varchar](100) NULL,
  [SetID] [int] NULL,
  [SeriesID] [int] NULL,
  [TaxCode] [nvarchar](50) NULL,
  [ManualAdjustment] [decimal](18, 2) NOT NULL CONSTRAINT [POL_DF_ManualAdjustment] DEFAULT (0.00),
  [ClearedAmount] [decimal](18, 2) NOT NULL CONSTRAINT [POL_DF_ClearedAmount] DEFAULT (0.00),
  [AdjustMentTotal] [decimal](18, 2) NOT NULL CONSTRAINT [POL_DF_AdjustMentTotal] DEFAULT (0.00),
  [RelievedAmount] [decimal](18, 2) NOT NULL CONSTRAINT [POL_DF_RelievedAmount] DEFAULT (0.00),
  [AvailToRelieve] [decimal](18, 2) NOT NULL CONSTRAINT [POL_DF_AvailToRelieve] DEFAULT (0.00),
  [DisplayAmount] [decimal](18, 2) NOT NULL CONSTRAINT [POL_DF_DisplayAmount] DEFAULT (0.00),
  [RelievedTotal] [decimal](18, 2) NOT NULL CONSTRAINT [POL_DF_RelievedTotal] DEFAULT (0.00),
  CONSTRAINT [PK_PurchaseOrderLine] PRIMARY KEY CLUSTERED ([POlineID])
)
GO

ALTER TABLE [dbo].[PurchaseOrderLine]
  ADD CONSTRAINT [POL_FK_COAString] FOREIGN KEY ([COAString]) REFERENCES [dbo].[COA] ([COACode])
GO

ALTER TABLE [dbo].[PurchaseOrderLine]
  ADD CONSTRAINT [POL_FK_POID] FOREIGN KEY ([COAID]) REFERENCES [dbo].[COA] ([COAID])
GO