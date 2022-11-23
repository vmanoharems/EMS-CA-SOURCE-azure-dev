CREATE TABLE [dbo].[SegmentLedger] (
  [SegmentId] [int] IDENTITY,
  [SegmentCode] [nvarchar](50) NOT NULL,
  [SegmentName] [nvarchar](50) NOT NULL,
  [SegmentReportDescription] [nvarchar](50) NOT NULL,
  [Classification] [nvarchar](50) NULL,
  [CodeLength] [nvarchar](50) NULL,
  [SegmentLevel] [int] NOT NULL,
  [DetailFlag] [bit] NULL,
  [ProdId] [int] NOT NULL,
  [CreatedDate] [datetime] NULL,
  [CreatedBy] [int] NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [SegmentStatus] [nvarchar](50) NULL,
  CONSTRAINT [PK_SegmentLedger_1] PRIMARY KEY CLUSTERED ([SegmentId])
)
GO