CREATE TABLE [dbo].[ClosePeriod] (
  [ClosePeriodId] [int] IDENTITY,
  [CompanyId] [int] NOT NULL,
  [CompanyPeriod] [int] NOT NULL,
  [StartPeriod] [datetime] NULL,
  [EndPeriod] [datetime] NULL,
  [Status] [nvarchar](50) NULL,
  [PeriodStatus] [nvarchar](50) NULL,
  [CreatedBy] [nvarchar](50) NULL,
  [ModifiedBy] [nvarchar](50) NULL,
  CONSTRAINT [PK_ClosePeriod] PRIMARY KEY CLUSTERED ([ClosePeriodId])
)
GO