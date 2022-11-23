CREATE TABLE [dbo].[TimeZone] (
  [UserID] [int] NOT NULL,
  [TimeZone] [varchar](100) NULL,
  [TimeDifference] [varchar](100) NULL,
  [SaveDate] [datetime] NULL,
  CONSTRAINT [PK_TimeZone] PRIMARY KEY CLUSTERED ([UserID])
)
GO