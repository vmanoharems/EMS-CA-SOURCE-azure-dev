SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetEpisodeForCRWFromBudget]
(
@ProdID int ,
@CO varchar(50),
@LO varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


select distinct S3 as AccountCode ,S3 from BudgetFile where Status='Processed' and Prodid=@ProdID
and S1=@CO and s2=@LO
order by S3

END



GO