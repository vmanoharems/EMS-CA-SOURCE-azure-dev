SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetSegmentWithLedgerToday] 
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
		declare @check int 

	set @check=(select SegmentLevel  from SegmentLedger  where ProdId=@ProdId)


	select * from Segment  where ProdId=@ProdId and SegmentLevel<@check

	union all
select *,'' as SubAccount1,'' as SubAccount2,'' as SubAccount3,'' as SubAccount4,'' as SubAccount5,'' as SubAccount6 from SegmentLedger where ProdId=@ProdId

union all

	select * from Segment  where ProdId=@ProdId and SegmentLevel>@check-1


order by SegmentLevel
END



GO