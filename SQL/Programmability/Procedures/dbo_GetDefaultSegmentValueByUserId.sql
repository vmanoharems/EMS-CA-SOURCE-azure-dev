SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetDefaultSegmentValueByUserId] -- GetDefaultSegmentValueByUserId 30,3
	-- Add the parameters for the stored procedure here
	@UserId int,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select  s.SegmentId,t.AccountCode,t.AccountId from Mydefault m
inner join Segment s on s.SegmentId=m.RefId
inner join TblAccounts t on s.SegmentId=t.SegmentId and m.Defvalue=t.AccountId
 where m.UserId=@UserId and m.Type='segment' and m.ProdId=@ProdId

END



GO