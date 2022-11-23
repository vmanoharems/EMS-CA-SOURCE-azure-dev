CREATE TABLE [dbo].[MyConfig] (
  [ConfigID] [int] NOT NULL,
  [Userid] [int] NOT NULL,
  [Moduleid] [int] NULL,
  [ConfigType] [varchar](30) NOT NULL,
  [EntityName] [varchar](30) NOT NULL,
  [EntityID] [int] NULL,
  [Trackid] [int] NULL,
  [Codeid] [int] NULL,
  [Valueid] [int] NULL,
  [StartDate] [datetime] NULL,
  [Enddate] [datetime] NULL,
  [Prodid] [int] NOT NULL
)
GO