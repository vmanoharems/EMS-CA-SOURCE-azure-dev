-- =============================================
CREATE PROCEDURE [dbo].[GetClosePeriodList]  -- GetClosePeriodList 53,1,1
(
@ProdID int,
@CID int,
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
/*
   if(@Mode=1)
   begin
    select distinct ClosePeriodID as CPeriod,ProdID as ProdID from Invoice where CompanyID=@CID and ProdID=@ProdID;
   end
   else if(@Mode=2)
    begin
*/
    select distinct ClosePeriod as CPeriod,ProdID as ProdID from JournalEntry where CompanyID=@CID and ProdID=@ProdID;
/*   end*/

END