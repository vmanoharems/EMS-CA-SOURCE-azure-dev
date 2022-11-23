SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetClosePeriodDeomJE] 
(
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  --select distinct ClosePeriod,ClosePeriod as Check1 from JournalEntry where ProdId=@ProdID and ClosePeriod >0

   select closePeriodID as  ClosePeriod,closePeriodID as Check1 from ClosePeriod  where  ClosePeriodID >0
END

GO