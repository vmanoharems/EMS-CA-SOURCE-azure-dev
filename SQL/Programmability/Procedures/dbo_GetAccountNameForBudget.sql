SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetAccountNameForBudget]
(
@ProdID int ,
@Classification varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select a.AccountId,a.AccountCode from TblAccounts as a inner join segment as b on a.SegmentType=b.Classification
where a.ProdId=@ProdID and b.ProdId=@ProdID and b.SegmentStatus='Completed' and b.Classification=@Classification

END



GO