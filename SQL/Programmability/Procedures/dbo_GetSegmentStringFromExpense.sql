SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


-- =============================================
CREATE PROCEDURE [dbo].[GetSegmentStringFromExpense]  --exec GetTransCodeFromExpense '1,6,20,21,32,,'
(
@SegmentStr varchar(500),
@ProdId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 
 select SegmentId,SegmentCode  from Segment where Classification in (select * from  dbo.SplitCSV(@SegmentStr,','))  and ProdId=@ProdId
 order by SegmentId ;
END




GO