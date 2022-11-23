SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetSegmentForPayroll]
(
@ProdId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select segmentid,SegmentCode,SegmentName,Classification,SegmentLevel,CodeLength from Segment
 where ProdId=@ProdId and SegmentStatus='Completed' order by SegmentLevel

END



GO